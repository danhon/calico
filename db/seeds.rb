help_user = User.find_or_initialize_by(
  email: User::FEEDBACK_USER_EMAIL,
  first_name: 'Calico Feedback',
  last_name: 'User',
) do |user|
  user.password = 'Password123'
end

image_file = File.open(File.join(Rails.root, '/public/assets/helper.png'))
help_user.profile_photo.store!(image_file)
help_user.save!

