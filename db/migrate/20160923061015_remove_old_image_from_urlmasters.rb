class RemoveOldImageFromUrlmasters < ActiveRecord::Migration
  def change
    remove_column :urlmasters, :oldImage, :string
  end
end
