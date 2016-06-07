import Immutable from 'immutable'
import React, { Component, DOM } from 'react'

export default class ChannelNav extends Component {
  lastMessageCreatedAt(messages) {
    if (messages && !messages.isEmpty()) {
      const sortedMessages = messages.sort((messageA, messageB) => {
        return messageA.get('id') < messageB.get('id')
      })
      return sortedMessages.first().get('created_at')
    } else {
      return null
    }
  }

  channelClass(readAt, lastMessageCreatedAt) {
    if (!lastMessageCreatedAt) {
      return 'read'
    } else if (!readAt) {
      return 'unread'
    } else if (readAt >= lastMessageCreatedAt) {
      return 'read'
    } else {
      return 'unread'
    }
  }

  userAndOther(channel, currentUserId) {
    const otherChannelUser = channel.get('channels_users').filter((channelUser) => (
      channelUser.get('user_id') !== currentUserId
    )).first()
    const channelUser = channel.get('channels_users').filter((channelUser) => (
      channelUser.get('user_id') === currentUserId
    )).first()
    return [channelUser, otherChannelUser]
  }

  render() {
    var divStyle = { background: 'white' }
    return (
      <div>
        <div className="sidebar-header"><i className="fa fa-comments" aria-hidden="true"></i>
          My Conversations
        </div>
        <ul className='channels' style={divStyle}>
          {
            this.props.data.map((channel, index) => {
              const [channelUser, otherChannelUser] = this.userAndOther(channel, this.props.currentUserId)
              let className = ''
              const isActive = (index === this.props.activeIndex)
              if (isActive) {
                className = 'active'
              } else {
                const lastCreatedAt = this.lastMessageCreatedAt(channel.get('messages'))
                className = this.channelClass(channelUser.get('read_at'), lastCreatedAt)
              }
              const fullName = `${otherChannelUser.getIn(['user', 'first_name'])} ${otherChannelUser.getIn(['user', 'last_name'])}`
              const onChannelSelect = () => { this.props.onChannelSelect(index) }
              return (
                <li key={`channel_${channel.get('id')}`} className={className}>
                  <a href='#' onClick={onChannelSelect}>
                    <img src={otherChannelUser.getIn(['user', 'profile_photo', 'small', 'url'])} alt={fullName} />
                    <span>{fullName}</span>
                  </a>
                </li>
                )
            })
          }
        </ul>
      </div>
    )
  }
}

ChannelNav.propTypes = {
  data: React.PropTypes.object,
  onChannelSelect: React.PropTypes.func,
  activeIndex: React.PropTypes.number,
  currentUserId: React.PropTypes.number,
}

ChannelNav.defaultProps = {
  data: Immutable.List(),
}
