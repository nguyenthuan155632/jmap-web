class RemoveSizeFromUrlmasters < ActiveRecord::Migration
  def change
    remove_column :urlmasters, :size, :string
  end
end
