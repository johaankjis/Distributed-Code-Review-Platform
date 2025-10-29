class ReviewComment < ApplicationRecord
  belongs_to :review
  belongs_to :author, class_name: 'User', foreign_key: 'author_id'

  validates :body, presence: true

  scope :on_file, ->(file_path) { where(file_path: file_path) }
  scope :general, -> { where(file_path: nil) }
end
