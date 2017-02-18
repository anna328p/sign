class CreateSchedules < ActiveRecord::Migration[5.0]
  def change
    create_table :schedules do |t|
      t.string :name
      t.text :contents
      t.string :notes

      t.timestamps
    end
  end
end
