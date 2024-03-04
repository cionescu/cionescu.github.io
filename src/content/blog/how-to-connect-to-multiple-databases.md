---
publishDate: 2023-07-10T00:00:00Z
title: How to connect to multiple databases in Ruby on Rails 7
excerpt: A deep dive into connecting to multiple databases with Ruby on Rails exploring multiple use-cases such as read-replicas and reading from legacy sources.
image: ~/assets/images/blog/how-to-connect-to-multiple-databases.webp
category: blog
tags:
  - ruby-on-rails
---

Rails 6 came out towards the end of 2019 and brought a lot of goodies. Among them was the announcement that Rails will now offer native support for multiple database connections. Sadly, it took me 3 years to find a good use case for this feature, but towards the end of 2022, it happened.

Our company has, what is affectionately known in the Rails community, as a Majestic Monolith. Since its inception, the monolith used a single PostgreSQL database. In late 2022, we experimented with a second connection that will help us access a read-only (legacy) database.

## How do you get started with adding a second database connection?

Your standard database config (stored in `config/database.yml`) probably looks similar to:

```yaml
development:
  adapter: postgresql
  host: postgres
```

In the multi-database world, each one of your environments gets the config for each database connection:

```yaml
development:
  primary:
    adapter: postgresql
    host: postgresql
  secondary:
    adapter: sqlserver
    host: sqlserver
```

If a primary configuration is provided, it will be used as the “default” configuration. If there is no configuration named “primary”, Rails will use the first configuration as default for each environment.

Since we are using Active Record as our ORM of choice, we need to add a new gem to our toolchain in order to continue using Active Record with our secondary connection: activerecord-sqlserver-adapter.

## Adding a new base class for the secondary database connection

By default, ApplicationRecord and all of its subclasses will use the primary connection for reading and writing. This is great because we want to retain that piece of functionality for our monolith.

The secondary connection we just added will read from a legacy database, so it would be nice of us to isolate the code needed to talk to it.

With this in mind, we created a new root-level model named Legacy. All of the Active Record models related to the Legacy database will subclass this model.

```ruby
class Legacy < ApplicationRecord
   self.abstract_class = true

   connects_to database: { reading: :legacy, writing: :legacy }
end
```

## Adding a read replica

While the legacy connection scenario I described was my personal use case, I believe the most common use of multiple database connections in Ruby on Rails is to decouple reading and writing to your data storage. For read-intensive applications, having multiple read replicas (ideally located in multiple locations to minimize round-trip time) can help improve your app performance.

This strategy can be implemented both at an app-level scale or the choice can be made, granularly, at the model level.

```ruby
class ApplicationRecord < ActiveRecord::Base
   self.abstract_class = true

   connects_to database: { reading: :primary_replica, writing: :primary }
end
```

Your database.yml config will now need to include both database connections:

```yaml
production:
  primary:
    database: my_primary_database
    username: root
    password: <%= ENV['ROOT_PASSWORD'] %>
    adapter: mysql2
  primary_replica:
    database: my_primary_database
    username: root_readonly
    password: <%= ENV['ROOT_READONLY_PASSWORD'] %>
    adapter: mysql2
    replica: true
```

When using a replica database, you need to add a replica: true entry to the replica in the database.yml. Rails will not run certain tasks, such as migrations, against replicas.

## Read-only database connections
This step might not apply to all, but it was an important one for my use case. Since I was connecting to this legacy database with the aim of ingesting data, I wanted to avoid overwriting data.

One thing Rails does automatically for us is to create, drop and migrate all databases configured. This means that, if we wanted to only migrate the database connected through our primary connection, we’d need extra configuration. Thankfully, Rails 7 added a feature for this under the ‘database_tasks’ config flag for database.yml

```yaml
development:
  primary:
    adapter: postgresql
    host: postgresql
  secondary:
    adapter: sqlserver
    host: sqlserver
    database_tasks: false # <<<<<-----------
```

Since I was working on a Rails 6 application, I had to back-port this feature. Luckily, GitLab encountered the same challenge and posted this snippet that you can drop in an initializer.

```ruby
# frozen_string_literal: true

if Rails::VERSION::MAJOR >= 7
  raise "Remove `#{__FILE__}`. This is backport of `database_tasks:` Rails 7.x feature."
end

# This backports `database_tasks:` feature to skip running migrations for some databases
# PR: https://github.com/rails/rails/pull/42794/files

module DatabaseTasks
  module ActiveRecordDatabaseConfigurations
    def configs_for(env_name: nil, name: nil, include_replicas: false)
      configs = super

      unless include_replicas
        if name
          configs = nil unless configs&.database_tasks?
        else
          configs = configs.select do |db_config|
            db_config.database_tasks?
          end
        end
      end

      configs
    end
  end

  module ActiveRecordDatabaseConfigurationsHashConfig
    def database_tasks? # :nodoc:
      !replica? && !!configuration_hash.fetch(:database_tasks, true)
    end
  end
end

ActiveRecord::DatabaseConfigurations.prepend(DatabaseTasks::ActiveRecordDatabaseConfigurations)
ActiveRecord::DatabaseConfigurations::HashConfig.prepend(DatabaseTasks::ActiveRecordDatabaseConfigurationsHashConfig)
```

## Switching the database connection on-demand

One nifty trick I found while digging into this was that Rails has a solution for on-the-go connection switching too. This mainly was useful as I was getting started and wanted to test things quickly. As soon as you drop the database connection details into database.yml, you can open a Rails console and exercise that connection:

```ruby
ApplicationRecord.connected_to(database: :secondary) {
  ApplicationRecord
    .connection
    .exec_query("SELECT * FROM public.Foo limit 10").to_a
}
```