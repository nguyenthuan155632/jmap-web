class MaintenanceController < ApplicationController
  http_basic_authenticate_with name: "superadmin", password: "sB4VFhaXnb"
  def start
  end

  def end
  end
end
