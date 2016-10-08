require 'csv'
class ImportController < ApplicationController

  helper_method :valid_json?      # Define to use this method in view

  def index
  end

  ##############################################################
  # Get data from tasks table and render to view
  ##############################################################
  def list
    @tasks = Task.all
  end

  def handle_file
    ################################### Version 1 ##########################################
    # csv = Array.new
    # result = Array.new
    # CSV.foreach(params[:file_input].path, { encoding: "UTF-8", headers: true, header_converters: :symbol, converters: :all}) do |row|
    #   csv << row.to_hash
    # end
    # for c in csv 
    #   arrMatch = Import.select("source_word").where(:source_word => c[:value])
    #   # arrMatch = data.select{ |value| value[:source_word] == c[:value] }
    #   if arrMatch.empty?
    #     result << c
    #   end
    # end
    # head = 'EF BB BF'.split(' ').map{|a|a.hex.chr}.join()
    # exportFile = CSV.generate(csv = head) do |writer|
    #   writer << ["type", "id", "name", "lang", "value"]
    #   result.each do |r|
    #     writer << [r[:type], r[:id], r[:name], r[:lang], r[:value]]
    #   end
    # end
    # send_data exportFile, filename: "DifferenceExtractor-#{Time.now.strftime("%y%m%d%H%M%S")}.csv", type: "text/csv"
    ################################### Version 2 ##########################################
  end

  ##############################################################
  # Get data from word_library table and return to (json format)
  # Get params from Ajax 
  # Query: SELECT `word_id`, `source_word`, `target_lang` FROM `word_management`.`word_library` WHERE `target_lang` = params[:target_lang]
  # Return :json
  ##############################################################
  def word_library 
    target_lang = params[:target_lang]
    data = Hash.new
    for tl in target_lang
      db = Import.select("word_id, source_word, target_lang, target_word, target_shortname").where(:target_lang => tl)
      data[tl] = db
    end
    render :json => data
    return
  end

  ##############################################################
  # Get data from poi_libraries table and return to (json format)
  # Get params from Ajax 
  # Query: SELECT `id`, `shop_id`, `shop_name`, `categoryid_1`, `categoryid_2`, `categoryid_3`, `categoryid_4` FROM `word_management`.`poi_libraries` 
  # Return :json
  ##############################################################
  def poi_libraries 
    data = PoiLibrary.select("id, shop_id, shop_name, categoryid_1, categoryid_2, categoryid_3, categoryid_4")
    render :json => data
    return
  end

  ##############################################################
  # Insert parameters into tasks table
  # Get params from Ajax 
  # Query: INSERT INTO `word_management`.`tasks` (`task`, `language`, `original`, `extract`, `registration`, `filename`) VALUES (params[:task], params[:language], params[:original], params[:extract], params[:registration], params[:filename])
  # Return :json
  ##############################################################
  def insert_db 
    task = params[:task]
    language = params[:language]
    original = params[:original]
    extract = params[:extract]
    registration = params[:registration]
    filename = params[:filename]
    status = params[:status]
    record = Task.new(:task => task,:language => language,:original => original,:extract => extract,:registration => registration,:filename => filename,:status => status)
    record.save
    render :json => "Import successfully!".to_json
    return
  end

  ##############################################################
  # Insert/Update parameters into word_library table
  # Get params from Ajax 
  # Query: INSERT INTO `word_management`.`word_library` (`source_lang`, `source_word`, `target_lang`, `target_word`) VALUES (params[:source_lang], params[:source_word], params[:target_lang], params[:target_word])
  #        UPDATE `word_management`.`word_library` SET `target_word` = params[:target_word] WHERE `word_id` = params[:word_id]
  # Return :json
  ##############################################################
  def insert_word_db 
    word_id = params[:word_id]
    source_lang = params[:source_lang]
    source_word = params[:source_word]
    target_lang = params[:target_lang]
    target_word = params[:target_word]
    source_shortname = params[:source_shortname]
    target_shortname = params[:target_shortname]
    if word_id != "0"
      record = Import.find_by(:word_id => word_id)
      record.update(:target_word => target_word, :source_shortname => source_shortname, :target_shortname => target_shortname)
    else
      record = Import.new(:source_lang => source_lang,:source_word => source_word,:target_lang => target_lang,:target_word => target_word,:source_shortname => source_shortname,:target_shortname => target_shortname)
      record.save
    end

    render :json => "Import successfully!".to_json
    return
  end

  ##############################################################
  # Insert/Update parameters into poi_libraries table
  # Get params from Ajax 
  # Query: INSERT INTO `word_management`.`poi_libraries` (`source_lang`, `source_word`, `target_lang`, `target_word`) VALUES (params[:source_lang], params[:source_word], params[:target_lang], params[:target_word])
  #        UPDATE `word_management`.`word_library` SET `target_word` = params[:target_word] WHERE `word_id` = params[:word_id]
  # Return :json
  ##############################################################
  def insert_poi_db 
    id = params[:id]
    shop_id = params[:shop_id]
    shop_name = params[:shop_name]
    categoryid_1 = params[:categoryid_1]
    categoryid_2 = params[:categoryid_2]
    categoryid_3 = params[:categoryid_3]
    categoryid_4 = params[:categoryid_4]
    if id != "0"
      record = PoiLibrary.find_by(:id => id)
      record.update(:categoryid_1 => categoryid_1,:categoryid_2 => categoryid_2,:categoryid_3 => categoryid_3,:categoryid_4 => categoryid_4)
    else
      record = PoiLibrary.new(:shop_id => shop_id,:shop_name => shop_name,:categoryid_1 => categoryid_1,:categoryid_2 => categoryid_2,:categoryid_3 => categoryid_3,:categoryid_4 => categoryid_4)
      record.save
    end

    render :json => "Import successfully!".to_json
    return
  end

  ##############################################################
  # Check valid json format
  # Return boolean value
  ##############################################################
  def valid_json?(json)
    begin
      JSON.parse(json)
      return true
    rescue JSON::ParserError => e
      return false
    end
  end

end
