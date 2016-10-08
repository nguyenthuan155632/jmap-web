Rails.application.routes.draw do

  get 'maintenance/start' => 'maintenance#start'

  get 'maintenance/end' => 'maintenance#end'

  resources :door, :only => [:index]
  resources :indoor_map, :only => [:index]
  get 'indoor_map_ad' => 'indoor_map#ad'
  resources :outdoor_map, :only => [:index]
  resources :area, :only => [:index]
  resources :info, :only => [:index]
  get 'info/contact' => 'info#contact'
  resources :exp, :only => [:index]
  resources :terms, :only => [:index]

  # Import page
  get 'import' => 'import#index'
  get 'import/list' => 'import#list'
  post 'import/handle_file' => 'import#handle_file'
  get 'import/word_library' => 'import#word_library'
  get 'import/poi_libraries' => 'import#poi_libraries'
  post 'import/insert_db' => 'import#insert_db'
  post 'import/insert_word_db' => 'import#insert_word_db'
  post 'import/insert_poi_db' => 'import#insert_poi_db' 
  # root :to => 'top#index'

  # Floor Map Crawler
  get 'crawler', to: 'crawler#index'

  get 'add', to: 'crawler#add', :as => 'add'
  post 'add', to: 'crawler#add_db'

  get 'edit/:id', to: 'crawler#edit', :as => 'edit'
  post 'edit/:id', to: 'crawler#edit_db'

  post 'update_db', to: 'crawler#update_db'

  delete 'delete/:id', to: 'crawler#delete'

  get 'export', to: 'crawler#export'
  get 'export_archive', to: 'crawler#export_archive'

  get 'error' => "crawler#error"
  post 'checkError' => "crawler#checkError"

  get 'difference' => "crawler#difference"
  post 'showDifference' => "crawler#showDifference"

  get 'archive' => 'crawler#archive'
  post 'archive' => 'crawler#archivePost'

  get 'restore' => 'crawler#restore'
  post 'restore' => 'crawler#restorePost'

  get 'capture' => 'crawler#capture'
  get 'log' => 'crawler#log'

  get 'test' => 'crawler#test'

  root :to => 'area#index'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
