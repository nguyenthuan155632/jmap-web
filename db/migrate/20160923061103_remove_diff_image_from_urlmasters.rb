class RemoveDiffImageFromUrlmasters < ActiveRecord::Migration
  def change
    remove_column :urlmasters, :diffImage, :string
  end
end
