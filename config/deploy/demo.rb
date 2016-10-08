server 'biz.indoor-navi.jp', user: 'ec2-user', roles: %w(app db web)

set :ssh_options, {
  keys: %(../.ssh/jmapdev.pem)
}

set :repo_url, 'git@52.69.46.99:/var/data/git/jmap-web.git'

set :rails_env, :development

set :default_env, {
  jmapapi_location: 'http://biz.indoor-navi.jp/v1/',
  jmapi18n_location: 'http://biz.indoor-navi.jp/i18n/'
}
