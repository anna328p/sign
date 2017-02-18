class AdminController < ApplicationController
  def index
  end
  def save_schedule
    Setting.schedule = params[:schedule]
  end
end
