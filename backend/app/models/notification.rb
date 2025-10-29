class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :pull_request, optional: true

  validates :type, presence: true
  validates :message, presence: true

  scope :unread, -> { where(is_read: false) }
  scope :read, -> { where(is_read: true) }
  scope :recent, -> { order(created_at: :desc).limit(50) }

  def mark_as_read!
    update(is_read: true)
  end
end
