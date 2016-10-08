require "active_record"

class Import < ActiveRecord::Base
	self.table_name = "word_library"
end