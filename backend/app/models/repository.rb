class Repository < ApplicationRecord
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'
  has_many :pull_requests, dependent: :destroy

  validates :github_id, presence: true, uniqueness: true
  validates :name, presence: true
  validates :full_name, presence: true

  scope :active, -> { where(is_active: true) }

  def open_pull_requests
    pull_requests.where(state: 'open')
  end

  def average_review_time
    completed_reviews = Review.joins(:pull_request)
                              .where(pull_requests: { repository_id: id })
                              .where(status: 'completed')
                              .where.not(completed_at: nil, assigned_at: nil)
    
    return 0 if completed_reviews.empty?
    
    total_seconds = completed_reviews.sum { |r| (r.completed_at - r.assigned_at).to_i }
    total_seconds / completed_reviews.count / 3600.0
  end
end
