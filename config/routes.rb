Rails.application.routes.draw do
  get 'home/offline'
  resources :posts do
    member do
      post :mensaje
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get 'offline', to: 'home#offline', as: :offline

  
  root 'posts#index'
end
