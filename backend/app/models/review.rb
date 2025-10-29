class Review < ApplicationRecord
  belongs_to :pull_request
  belongs_to :reviewer, class_name: 'User', foreign_key: 'reviewer_id'
  has_many :review_comments, dependent: :destroy

  validates :status, inclusion: { in: %w[pending in_progress completed approved rejected] }
  validates :priority, inclusion: { in: %w[low normal high urgent] }

  scope :pending, -> { where(status: 'pending') }
  scope :in_progress, -> { where(status: 'in_progress') }
  scope :completed, -> { where(status: 'completed') }
  scope :high_priority, -> { where(priority: ['high', 'urgent']) }

  before_create :set_assigned_at

  def start!
    update(status: 'in_progress', started_at: Time.current)
  end

  def complete!(final_status = 'completed')
    update(status: final_status, completed_at: Time.current)
  end

  def review_duration_hours
    return nil unless completed_at && assigned_at
    ((completed_at - assigned_at) / 3600.0).round(2)
  end

  private

  def set_assigned_at
    self.assigned_at ||= Time.current
  end
end
