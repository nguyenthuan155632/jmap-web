class RemoveNewImageFromUrlmasters < ActiveRecord::Migration
  def change
    remove_column :urlmasters, :newImage, :string
  end
end
