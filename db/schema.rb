# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160930024919) do

  create_table "areas", force: :cascade do |t|
    t.string   "areaid",     limit: 255
    t.text     "lat",        limit: 65535
    t.text     "lon",        limit: 65535
    t.text     "url",        limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.string   "area_type",  limit: 255
  end

  add_index "areas", ["areaid"], name: "index_areas_on_areaid", using: :btree

  create_table "attributes", force: :cascade do |t|
    t.string   "venueId",    limit: 255,   null: false
    t.string   "shopId",     limit: 255,   null: false
    t.string   "name",       limit: 255
    t.text     "value",      limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "attributes", ["shopId", "name"], name: "index_attributes_on_shopId_and_name", using: :btree
  add_index "attributes", ["venueId", "name"], name: "index_attributes_on_venueId_and_name", using: :btree

  create_table "category_master", force: :cascade do |t|
    t.string   "category_id",       limit: 255, null: false
    t.string   "category_parentId", limit: 255
    t.string   "categoryAttr1",     limit: 255
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  add_index "category_master", ["category_id"], name: "index_category_master_on_category_id", using: :btree

  create_table "category_set", force: :cascade do |t|
    t.string   "catset_id",   limit: 255
    t.string   "category_id", limit: 255, null: false
    t.string   "shopId",      limit: 255, null: false
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  add_index "category_set", ["shopId"], name: "index_category_set_on_shopId", using: :btree

  create_table "conversion_locales", force: :cascade do |t|
    t.string   "locale",      limit: 255, null: false
    t.string   "lang",        limit: 255, null: false
    t.string   "description", limit: 255
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "histories", force: :cascade do |t|
    t.string   "mapId",        limit: 255
    t.string   "floor",        limit: 255
    t.string   "oldImage",     limit: 255
    t.string   "newImage",     limit: 255
    t.string   "diffImage",    limit: 255
    t.string   "size",         limit: 255
    t.string   "generation",   limit: 255
    t.string   "oldLinkImage", limit: 255
    t.string   "newLinkImage", limit: 255
    t.string   "countHistory", limit: 255
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.string   "venueName",    limit: 255
  end

  create_table "inquiries", force: :cascade do |t|
    t.string   "emailaddress", limit: 255
    t.datetime "inquiry_date"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.text     "content",      limit: 65535
  end

  create_table "locales", force: :cascade do |t|
    t.string   "lang",        limit: 10,  null: false
    t.string   "description", limit: 255
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  add_index "locales", ["lang"], name: "index_locales_on_lang", unique: true, using: :btree

  create_table "logs", force: :cascade do |t|
    t.text     "message",    limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  create_table "poi_libraries", force: :cascade do |t|
    t.string "area_id",         limit: 255
    t.text   "area_name",       limit: 65535
    t.string "floor_name",      limit: 255
    t.string "shop_id",         limit: 255
    t.text   "shop_name",       limit: 65535
    t.string "categoryvalue_1", limit: 255
    t.string "categoryvalue_2", limit: 255
    t.string "categoryvalue_3", limit: 255
    t.string "categoryvalue_4", limit: 255
    t.string "categoryid_1",    limit: 255
    t.string "categoryid_2",    limit: 255
    t.string "categoryid_3",    limit: 255
    t.string "categoryid_4",    limit: 255
    t.text   "master_category", limit: 65535
  end

  create_table "sessions", force: :cascade do |t|
    t.string   "session_id", limit: 255,   null: false
    t.text     "data",       limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], name: "index_sessions_on_session_id", unique: true, using: :btree
  add_index "sessions", ["updated_at"], name: "index_sessions_on_updated_at", using: :btree

  create_table "shops", force: :cascade do |t|
    t.string   "venueId",      limit: 255, null: false
    t.string   "drowingId",    limit: 255, null: false
    t.string   "floorId",      limit: 255, null: false
    t.string   "shopId",       limit: 255, null: false
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.string   "shop_type",    limit: 255
    t.string   "floor_number", limit: 255
  end

  add_index "shops", ["venueId"], name: "index_shops_on_venueId", using: :btree

  create_table "tasks", force: :cascade do |t|
    t.string   "task",         limit: 255
    t.string   "language",     limit: 255
    t.text     "original",     limit: 4294967295
    t.text     "extract",      limit: 4294967295
    t.text     "registration", limit: 4294967295
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.string   "filename",     limit: 255
    t.string   "status",       limit: 255
  end

  create_table "texts", force: :cascade do |t|
    t.string   "type",       limit: 10,    null: false
    t.string   "entity_id",  limit: 20,    null: false
    t.string   "name",       limit: 20,    null: false
    t.string   "lang",       limit: 10,    null: false
    t.text     "value",      limit: 65535, null: false
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "texts", ["type", "entity_id", "name", "lang"], name: "index_texts_on_type_and_entity_id_and_name_and_lang", unique: true, using: :btree

  create_table "urlmasters", force: :cascade do |t|
    t.string   "mapId",                 limit: 255
    t.string   "venueName",             limit: 255
    t.string   "floor",                 limit: 255
    t.string   "typeMap",               limit: 255
    t.string   "venueFloorMapImageUrl", limit: 255
    t.string   "venueFloorMapUrl",      limit: 255
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.string   "statusCode",            limit: 255
    t.string   "statusCodeWeb",         limit: 255
    t.datetime "lastModified"
    t.string   "archive",               limit: 255
    t.datetime "archiveTime"
    t.string   "typeUrl",               limit: 255
  end

  create_table "venues", force: :cascade do |t|
    t.string   "areaId",       limit: 255,               null: false
    t.string   "venueId",      limit: 255,               null: false
    t.string   "country",      limit: 255
    t.text     "business",     limit: 65535
    t.text     "lat",          limit: 65535
    t.text     "lon",          limit: 65535
    t.string   "zipCode",      limit: 255
    t.text     "imageUrl",     limit: 65535
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.string   "venue_type",   limit: 255
    t.string   "officialUrl",  limit: 255
    t.integer  "display_flag", limit: 4,     default: 1, null: false
    t.datetime "last_updated"
  end

  add_index "venues", ["areaId"], name: "index_venues_on_areaId", using: :btree
  add_index "venues", ["venueId"], name: "index_venues_on_venueId", using: :btree

  create_table "word_library", primary_key: "word_id", force: :cascade do |t|
    t.string "source_lang",      limit: 6
    t.string "source_word",      limit: 500
    t.string "target_lang",      limit: 6
    t.string "target_word",      limit: 500
    t.string "source_shortname", limit: 255
    t.string "target_shortname", limit: 255
  end

end
