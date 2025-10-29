class User < ApplicationRecord
  has_many :pull_requests, foreign_key: 'author_id'
  has_many :reviews, foreign_key: 'reviewer_id'
  has_many :repositories, foreign_key: 'owner_id'
  has_many :notifications
  has_many :reviewer_assignments, foreign_key: 'reviewer_id'

  validates :github_id, presence: true, uniqueness: true
  validates :username, presence: true

  def active_reviews
    reviews.where(status: ['pending', 'in_progress'])
  end

  def completed_reviews_count
    reviews.where(status: 'completed').count
  end

  def average_review_time
    completed = reviews.where(status: 'completed').where.not(completed_at: nil, assigned_at: nil)
    return 0 if completed.empty?
    
    total_seconds = completed.sum { |r| (r.completed_at - r.assigned_at).to_i }
    total_seconds / completed.count / 3600.0 # Convert to hours
  end
end
