class AddTypeUrlToUrlMasters < ActiveRecord::Migration
  def change
    add_column :urlmasters, :typeUrl, :string
  end
end
