require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "should get offline" do
    get home_offline_url
    assert_response :success
  end
end
