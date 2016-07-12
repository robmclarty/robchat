curl \
  -X GET \
  http://localhost:3000

curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin", "password":"password"}' \
  http://localhost:3000/tokens

curl \
  -X PUT \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOiIxMjM0NTYiLCJpc0FjdGl2ZSI6dHJ1ZSwicGVybWlzc2lvbnMiOnsibXktYXBwLW5hbWUiOnsiYWN0aW9ucyI6WyJhY3Rpb24xIiwiYWN0aW9uMiIsImFjdGlvbk4iXX19LCJpYXQiOjE0NjY3MTYyNTIsImV4cCI6MTQ2NzMyMTA1MiwiaXNzIjoibXktaXNzdWVyLW5hbWUiLCJqdGkiOiJTa2dIdnhDWUIifQ.lvZn2pi95i02mYghDIQ9vdqxC2jO0d1i7MCY7r0aqJFfpldNVGwEc2OBGbtFy_LaV8eCTdnOJi21SAD1KBpkbA" \
  http://localhost:3000/refresh

curl \
  -X DELETE \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOiIxMjM0NTYiLCJpc0FjdGl2ZSI6dHJ1ZSwicGVybWlzc2lvbnMiOnsibXktYXBwLW5hbWUiOnsiYWN0aW9ucyI6WyJhY3Rpb24xIiwiYWN0aW9uMiIsImFjdGlvbk4iXX19LCJpYXQiOjE0NjY3MTYyODAsImV4cCI6MTQ2NzMyMTA4MCwiaXNzIjoibXktaXNzdWVyLW5hbWUiLCJqdGkiOiJyMWdsS3hSdHIifQ.QbbZYGUKN1DKwuIjfmHEXCL6k-Rey_N4c_wRrMnRWvDBsNC708aiprO-4ezyfCW-dpfCb4YqaFdLFzPTGI1RYA" \
  http://localhost:3000/revoke

curl \
  -X GET \
  -H "Authorization: Bearer eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Nzg1MjRlYzJhOWU1ZWI3YzM1NGU5ODciLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBlbWFpbC5jb20iLCJpc0FjdGl2ZSI6dHJ1ZSwiaXNBZG1pbiI6dHJ1ZSwicGVybWlzc2lvbnMiOnt9LCJpYXQiOjE0NjgzNDM2MTUsImV4cCI6MTQ2ODQzMDAxNSwiaXNzIjoicmViZWwtY2hhdCIsImp0aSI6Ikh5REJIb3pQIn0.i80LTRzgw3pzlKtVhCDzE_xKhXeVvBhE1wVEWhvYfs-PTPSexyZ2htlYDYn3Zex8NqCHrX4NTn8Qh33f-isJXNGv-hI49dfWzbZNExQ-GZlyC4bwvGZIEpV3ISnhWmpQ" \
  http://localhost:3000/users
