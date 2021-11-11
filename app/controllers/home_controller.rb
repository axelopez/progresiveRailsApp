class HomeController < ApplicationController
  def offline
    render 'offline', layout: false
  end
end
