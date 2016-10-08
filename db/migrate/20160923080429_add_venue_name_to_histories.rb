class AddVenueNameToHistories < ActiveRecord::Migration
  def change
    add_column :histories, :venueName, :string
  end
end
