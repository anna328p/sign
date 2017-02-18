Rails.application.routes.draw do
  resources :schedules
  get 'posts/listview'
  get 'menu_items/listview'
  resources :menu_items
  resources :posts
  get 'index/index'
  root 'index#index'
  get 'admin', :controller => :admin, :action => :index
  get 'admin/save-schedule'
  post 'admin/save-schedule'



  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
