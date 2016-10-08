require 'csv'
require 'net/http'
require 'uri'
class CrawlerController < ApplicationController

  # Home page
  def index
    @Urlmasters = Urlmaster.all
    logs = Log.last
    if logs
      @refresh_time = Log.last.created_at.in_time_zone("Asia/Tokyo").strftime("%Y-%m-%d %H:%M:%S")
    else
      @refresh_time = nil
    end
  end

  # `Add url master` page
  def add
  end

  # Create a new url master
  def add_db
    mapId                   = params[:mapId]
    venueName               = params[:venueName]
    floor                   = params[:floor]
    typeMap                 = params[:typeMap]
    venueFloorMapImageUrl   = params[:venueFloorMapImageUrl]
    venueFloorMapUrl        = params[:venueFloorMapUrl]
    urlMaster = Urlmaster.create(:mapId => mapId, :venueName => venueName, :floor => floor, :typeMap => typeMap, :venueFloorMapImageUrl => venueFloorMapImageUrl, :venueFloorMapUrl => venueFloorMapUrl)
    if urlMaster
      redirect_to crawler_path
    else
      render :action => :add
    end
  end

  # Render a `url master` for modifying
  def edit
    session[:return_to] ||= request.referer
    @Urlmaster = Urlmaster.find(params[:id])
  end

  # Edit a url master
  def edit_db
    id                      = params[:id]
    mapId                   = params[:mapId]
    venueName               = params[:venueName]
    floor                   = params[:floor]
    typeMap                 = params[:typeMap]
    venueFloorMapImageUrl   = params[:venueFloorMapImageUrl]
    venueFloorMapUrl        = params[:venueFloorMapUrl]
    urlMaster = Urlmaster.find(id)
    urlMaster.update(:mapId => mapId, :venueName => venueName, :floor => floor, :typeMap => typeMap, :venueFloorMapImageUrl => venueFloorMapImageUrl, :venueFloorMapUrl => venueFloorMapUrl)
    if urlMaster
      redirect_to session.delete(:return_to)
    else
      render :action => :edit
    end
  end

  # Import CSV file to `urlmasters` table
  def update_db
    csv = Array.new
    CSV.foreach(params[:update_db].path, { encoding: "UTF-8", headers: true}) do |row|
      csv << row.to_hash
    end
    for c in csv 
      typeUrl = ""
      if c["venueFloorMapImageUrl"] && c["venueFloorMapImageUrl"] != "" && c["venueFloorMapImageUrl"] != "NA"
        typeUrl = "I"
      elsif c["venueFloorMapUrl"] && c["venueFloorMapUrl"] != "" && c["venueFloorMapUrl"] != "NA"
        typeUrl = "W"
      end
      url = Urlmaster.where(:mapId => c.values[0].to_s.strip, :venueName => c["venueName"].to_s.strip, :floor => c["floor"].to_s.strip).first
      if url
        urlMaster = Urlmaster.find(url.id)
        urlMaster.update(:typeMap => c["typeMap"], :venueFloorMapImageUrl => c["venueFloorMapImageUrl"].to_s.strip, :venueFloorMapUrl => c["venueFloorMapUrl"].to_s.strip, :typeUrl => typeUrl)
      else
        urlMaster = Urlmaster.create(:mapId => c.values[0].to_s.strip, :venueName => c["venueName"].to_s.strip, :floor => c["floor"].to_s.strip, :typeMap => c["typeMap"].to_s.strip, :venueFloorMapImageUrl => c["venueFloorMapImageUrl"].to_s.strip, :venueFloorMapUrl => c["venueFloorMapUrl"].to_s.strip, :typeUrl => typeUrl) 
      end
    end
    redirect_to crawler_path
  end

  # Delete a url master
  def delete
    urlMaster = Urlmaster.find(params[:id])
    urlMaster.destroy

    if urlMaster
      redirect_to crawler_path
    end
  end

  # Export CSV file (all of `urlmasters` table)
  def export
    result = Urlmaster.all
    head = 'EF BB BF'.split(' ').map{|a|a.hex.chr}.join()
    exportFile = CSV.generate(csv = head) do |writer|
      writer << ["mapId", "venueName", "floor", "typeMap", "venueFloorMapImageUrl", "venueFloorMapUrl"]
      result.each do |r|
        writer << [r[:mapId], r[:venueName], r[:floor], r[:typeMap], r[:venueFloorMapImageUrl], r[:venueFloorMapUrl]]
      end
    end
    send_data exportFile, filename: "MapCrawler-#{Time.now.in_time_zone("Asia/Tokyo").strftime("%y%m%d%H%M%S")}.csv", type: "text/csv"
    # redirect_to crawler_path
  end

  # Render `Error url master` list
  def error
    @urlMasterError = Urlmaster.find_by_sql("SELECT * FROM urlmasters WHERE statusCode LIKE '40%' OR statusCode LIKE '50%' OR statusCodeWeb LIKE '40%' OR statusCodeWeb LIKE '50%' OR statusCode LIKE '30%' OR statusCodeWeb LIKE '30%'")
  end

  # Check error url master
  def checkError
    status = Array.new
    if params[:offset]
      if params[:limit] != ""
        urlMasters = Urlmaster.limit(params[:limit].to_i).offset(params[:offset].to_i)
      else
        urlMasters = Urlmaster.offset(params[:offset].to_i)
      end
    else
      if params[:limit] != ""
        urlMasters = Urlmaster.limit(params[:limit].to_i).offset(0)
      else
        redirect_to crawler_path
        urlMasters = Urlmaster.all
      end
    end

    message = Array.new
    for url in urlMasters 
      if url["venueFloorMapImageUrl"] && url["venueFloorMapImageUrl"] != "NA" && url["venueFloorMapImageUrl"] != ""
        uri = URI(url["venueFloorMapImageUrl"])
        begin 
          res = Net::HTTP.get_response(uri)
          status << res.code
          message << url["venueFloorMapImageUrl"] + res.code
          u = Urlmaster.find(url.id)
          u.update(:statusCode => res.code)
        rescue => e
          next
        end
      end
      if url["venueFloorMapUrl"] && url["venueFloorMapUrl"] != "NA" && url["venueFloorMapUrl"] != ""
        uri = URI(url["venueFloorMapUrl"])
        begin 
          res = Net::HTTP.get_response(uri)
          status << res.code
          message << url["venueFloorMapUrl"] + res.code
          u = Urlmaster.find(url.id)
          u.update(:statusCodeWeb => res.code)
        rescue => e
          next
        end
      end
    end
    flash[:success] = "Refresh successfully!"
    render :json => message
  end

  # Render `Comparison History` list
  def difference
  	@history = History.find_by_sql("SELECT histories.*, urlmasters.venueName, urlmasters.typeUrl FROM histories LEFT JOIN urlmasters ON (histories.mapId = urlmasters.mapId AND histories.floor = urlmasters.floor) WHERE (diffImage IS NOT NULL AND archive IS NULL) ORDER BY mapId DESC, floor DESC, created_at ASC")
  end
  
  # HttpPost: compare image difference
  def showDifference 
    require 'rmagick'
    require 'open-uri'

    # Get urlmaster list need to scan
    if params[:offset]
      if params[:limit] != ""
        urlMasters = Urlmaster.where(:archive => nil).limit(params[:limit].to_i).offset(params[:offset].to_i)
      else
        urlMasters = Urlmaster.where(:archive => nil).offset(params[:offset].to_i)
      end
    else
      if params[:limit] != ""
        urlMasters = Urlmaster.where(:archive => nil).limit(params[:limit].to_i).offset(0)
      else
        urlMasters = Urlmaster.where(:archive => nil)
      end
    end
    # End

    message = Array.new
    message << "Refresh successfully!"    
    for url in urlMasters
    	u = Urlmaster.find(url.id)
      # If `venueFloorMapImageUrl` is not null
      if u[:venueFloorMapImageUrl] && u[:venueFloorMapImageUrl] != "NA" && u[:venueFloorMapImageUrl] != "" 
        if u[:typeUrl] == "W"
          next
        end
        uri = URI(u[:venueFloorMapImageUrl])
        # Get response header
        begin 
          res = Net::HTTP.get_response(uri)
        rescue => e
          error = "Error url - Cannot fetch page: " + u[:venueFloorMapImageUrl] + "(" + u[:mapId] + " - " + u[:venueName] + ' - ' + u[:floor] + ")"
          message << error
          next
        end
        # If `lastModified` field in DB AND `last-modified` field in response exist AND they have same value => Skip (do not scan)
        if u[:lastModified] && res["last-modified"] && u[:lastModified] >= res["last-modified"]
          # Skip
        else
          u.update(:lastModified => res["last-modified"])
          # Get extension image file
          extFile = File.extname(u[:venueFloorMapImageUrl])
          if extFile == ".pdf" 
            extFile = ".png"
          end
          # Create name image filename for saving
          if res["last-modified"]
            newImg = u[:mapId] + "F" + u[:floor] + "_" + DateTime.parse(res["last-modified"]).strftime("%Y%m%d") + extFile
            newLinkImg = DateTime.parse(res["last-modified"]).strftime("%Y%m%d")
          else
            newImg = u[:mapId] + "F" + u[:floor] + "_@NA" + DateTime.parse(res["date"]).strftime("%Y%m%d") + extFile
            newLinkImg = "@NA" + DateTime.parse(res["date"]).strftime("%Y%m%d")
          end
          saveNewImg = 'public/crawler/' + newImg
          history = History.where(:mapId => u[:mapId], :venueName => u[:venueName], :floor => u[:floor])
          lastRecord = history.order(:created_at).last
          if history.count != 0
            oldImage = lastRecord[:newImage]
            oldLinkImage = lastRecord[:newLinkImage]
            if oldLinkImage == newLinkImg
              next
            end
            begin 
              open(saveNewImg, 'wb') do |file|
                file << open(u[:venueFloorMapImageUrl]).read
              end
              saveOldImg = "public/crawler/" + oldImage
              diffFileName = u[:mapId] + "F" + u[:floor] + "_" + oldLinkImage + "_" + newLinkImg + "diff" + ".jpg"
              diffFilePath = "public/crawler/" + diffFileName
              compareImage(saveOldImg, saveNewImg, diffFilePath)
              diffSize = File.size(diffFilePath)
              History.create(:mapId => u[:mapId], :floor => u[:floor], :oldImage => oldImage, :oldLinkImage => oldLinkImage, :newImage => newImg, :newLinkImage => newLinkImg, :diffImage => diffFileName, :size => diffSize, :venueName => u[:venueName])
            rescue
              error = "Cannot compare difference " + u[:venueFloorMapImageUrl] + "(" + u[:mapId] + " - " + u[:venueName] + " - " + u[:floor] + ")"
              message << error
              next
            end
            newHistory = History.where(:mapId => u[:mapId], :venueName => u[:venueName], :floor => u[:floor]).where.not(:diffImage => nil).order(:created_at)
            allCountNewHistory = newHistory.count
            countNewHistory = newHistory.count
            newHistory.each do |h|
              generation = 1 - countNewHistory
              countNewHistory = countNewHistory - 1
              n = History.find(h.id)
              n.update(:countHistory => allCountNewHistory, :generation => generation)
            end
          else
            begin 
              open(saveNewImg, 'wb') do |file|
                file << open(u[:venueFloorMapImageUrl]).read
              end
              History.create(:mapId => u[:mapId], :floor => u[:floor], :newImage => newImg, :newLinkImage => newLinkImg, :venueName => u[:venueName])
            rescue => e
              error = "Cannot save file " + u[:venueFloorMapImageUrl] + "(" + u[:mapId] + " - " + u[:venueName] + " - " + u[:floor] + ")"
              message << error
              next
            end
          end
        end
      # If `venueFloorMapUrl` is not null
      elsif u[:venueFloorMapUrl] && u[:venueFloorMapUrl] != "NA" && u[:venueFloorMapUrl] != ""
        if u[:typeUrl] == "I"
          next
        end
        uri = URI(u[:venueFloorMapUrl])
        # Get response header
        begin 
          res = Net::HTTP.get_response(uri)
        rescue => e
          error = "Error url - Cannot fetch page: " + u[:venueFloorMapUrl] + "(" + u[:mapId] + " - " + u[:venueName] + ' - ' + u[:floor] + ")"
          message << error
          next
        end
        if u[:lastModified] && res["last-modified"] && u[:lastModified] >= res["last-modified"]
          # Skip
        else
          u.update(:lastModified => res["last-modified"])
          extFile = ".jpg"
          if res["last-modified"]
            newImg = u[:mapId] + "F" + u[:floor] + "W_" + DateTime.parse(res["last-modified"]).strftime("%Y%m%d") + extFile
            newLinkImg = DateTime.parse(res["last-modified"]).strftime("%Y%m%d")
          else
            newImg = u[:mapId] + "F" + u[:floor] + "W_@NA" + DateTime.parse(res["date"]).strftime("%Y%m%d") + extFile
            newLinkImg = "@NA" + DateTime.parse(res["date"]).strftime("%Y%m%d")
          end
          saveNewImg = 'public/crawler/' + newImg
          history = History.where(:mapId => u[:mapId], :venueName => u[:venueName], :floor => u[:floor])
          lastRecord = history.order(:created_at).last
          if history.count != 0
            oldImage = lastRecord[:newImage]
            oldLinkImage = lastRecord[:newLinkImage]
            if oldLinkImage == newLinkImg
              next
            end
            begin 
              url2image(u[:venueFloorMapUrl], saveNewImg)
              saveOldImg = "public/crawler/" + oldImage
              diffFileName = u[:mapId] + "F" + u[:floor] + "W_" + oldLinkImage + "_" + newLinkImg + "diff" + extFile
              diffFilePath = "public/crawler/" + diffFileName
              compareImage(saveOldImg, saveNewImg, diffFilePath)
              diffSize = File.size(diffFilePath)
              History.create(:mapId => u[:mapId], :floor => u[:floor], :oldImage => oldImage, :oldLinkImage => oldLinkImage, :newImage => newImg, :newLinkImage => newLinkImg, :diffImage => diffFileName, :size => diffSize, :venueName => u[:venueName])
            rescue
              error = "Cannot compare difference " + u[:venueFloorMapUrl] + "(" + u[:mapId] + " - " + u[:venueName] + " - " + u[:floor] + ")"
              message << error
              next
            end
            newHistory = History.where(:mapId => u[:mapId], :venueName => u[:venueName], :floor => u[:floor]).where.not(:diffImage => nil).order(:created_at)
            allCountNewHistory = newHistory.count
            countNewHistory = newHistory.count
            newHistory.each do |h|
              generation = 1 - countNewHistory
              countNewHistory = countNewHistory - 1
              n = History.find(h.id)
              n.update(:countHistory => allCountNewHistory, :generation => generation)
            end
          else
            begin 
              url2image(u[:venueFloorMapUrl], saveNewImg)
              History.create(:mapId => u[:mapId], :floor => u[:floor], :newImage => newImg, :newLinkImage => newLinkImg, :venueName => u[:venueName])
            rescue => e
              error = "Cannot save file " + u[:venueFloorMapUrl] + "(" + u[:mapId] + " - " + u[:venueName] + " - " + u[:floor] + ")"
              message << error
              next
            end
          end
        end
      else
        next
      end
    end

    # Error message - Insert errors into DB
    if message
      message.each do |m|
        log = Log.create(:message => m)
      end
    end
    flash[:messages] = message
    render :json => message
  	
  end

  # Render archive list to Archive Page 
  def archive
    if !params[:archive] || params[:archive] == "true"
      @archive = "true" 
      @urlMasters = Urlmaster.where(:archive => "archive").order(:archiveTime => :desc)
    else
      @archive = "false"
      @urlMasters = Urlmaster.where(:archive => nil)
    end
    flash[:archive] = @archive    
  end

  # Add `archive` status
  def archivePost
    id = params[:id]
    if id 
      history = History.find(id)
      archiveTime = DateTime.now
      urlMaster = Urlmaster.where(:mapId => history[:mapId], :floor => history[:floor]).first
      urlMaster.update(:archive => "archive", :archiveTime => archiveTime)
    end
    render :json => ["success"]
  end

  # Remove `archive` status
  def restorePost
    id = params[:id]
    if id 
      urlMaster = Urlmaster.find(id)
      urlMaster.update(:archive => nil, :archiveTime => nil)
    end
    render :json => ["success"]
  end

  # Export CSV file (Archive Page)
  def export_archive
    if flash[:archive]
      if flash[:archive] == "true"
        result = Urlmaster.where(:archive => "archive").order(:archiveTime => :desc)
        nameArc = "Archive"
      elsif flash[:archive] == "false"
        result = Urlmaster.where(:archive => nil)
        nameArc = "NotArchive"
      end 
    end
    # `result` variable contains list needed to export
    head = 'EF BB BF'.split(' ').map{|a|a.hex.chr}.join()
    exportFile = CSV.generate(csv = head) do |writer|
      writer << ["mapId", "venueName", "floor", "typeMap", "venueFloorMapImageUrl", "venueFloorMapUrl"]
      result.each do |r|
        writer << [r[:mapId], r[:venueName], r[:floor], r[:typeMap], r[:venueFloorMapImageUrl], r[:venueFloorMapUrl]]
      end
    end
    send_data exportFile, filename: "MapCrawler-" + nameArc + "-#{Time.now.in_time_zone("Asia/Tokyo").strftime("%y%m%d%H%M%S")}.csv", type: "text/csv"
  end

  # Render `logs` from DB 
  def log
    @logs = Log.all.reverse
  end

  # Delete a file
  def deleteFile file
    begin 
      if File.exist?(file)
        File.delete(file)
      end
    rescue => e
    end
  end

  def compareImage(oldImg, newImg, diffFilePath) 
    # Create RMagick instances
    image_src = Magick::ImageList.new
    image_dst = Magick::ImageList.new
    # Path to directory 2 images needed to compare
    urlimage_src = open(oldImg) 
    urlimage_dst = open(newImg)
    image_src.from_blob(urlimage_src.read)
    image_dst.from_blob(urlimage_dst.read)
    
    # Compare 2 images (dimensions based on destination image)
    difference = image_dst.composite(image_src, Magick::CenterGravity, Magick::DifferenceCompositeOp)
      
    # Create difference image file
    difference.write(diffFilePath)
  end

  # Webpage to image
  def url2image(url, path)
    ws = Webshot::Screenshot.instance
    ws.capture(url, path) do |magick|
      magick.combine_options do |c|
        c.thumbnail "1600x"
        c.background "white"
        c.gravity "north"
        c.quality 85
      end
    end
  end

  def test
    uri = URI("http://www.shibuya109.jp/shoplist/floor/#floor-b2f")
    res = Net::HTTP.get_response(uri)
    status = res.code.to_s
    render :json => status
    # result = Urlmaster.all
    # head = 'EF BB BF'.split(' ').map{|a|a.hex.chr}.join()
    # exportFile = CSV.generate(csv = head) do |writer|
    #   writer << ["mapId", "floor", "lastModified"]
    #   result.each do |r|
    #     if r[:lastModified]
    #       lastModified = DateTime.parse(r[:lastModified].to_s).strftime("%Y%m%d")
    #     else
    #       lastModified = ""
    #     end
    #     writer << [r[:mapId], r[:floor], lastModified]
    #   end
    # end
    # send_data exportFile, filename: "Test-#{Time.now.in_time_zone("Asia/Tokyo").strftime("%y%m%d%H%M%S")}.csv", type: "text/csv"
  end


end
 