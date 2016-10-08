class CreateUrlmasters < ActiveRecord::Migration
  def change
    create_table :urlmasters do |t|
      t.string :mapId
      t.string :venueName
      t.string :floor
      t.string :typeMap
      t.string :venueFloorMapImageUrl
      t.string :venueFloorMapUrl
      t.string :statusCode
      t.string :statusCodeWeb
      t.datetime :lastModified
      t.string :oldImage
      t.string :newImage
      t.string :diffImage
      t.string :size
      t.string :archive
      t.datetime :archiveTime

      t.timestamps null: false
    end
  end
end
