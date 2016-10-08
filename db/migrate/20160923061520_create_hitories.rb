class CreateHitories < ActiveRecord::Migration
  def change
    create_table :hitories do |t|
      t.string :mapId
      t.string :floor
      t.string :oldImage
      t.string :newImage
      t.string :diffImage
      t.string :size
      t.string :generation
      t.string :oldLinkImage
      t.string :newLinkImage
      t.string :countHistory

      t.timestamps null: false
    end
  end
end
