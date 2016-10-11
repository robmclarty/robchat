'use strict'

// Attributes used to populate friend objects.
const FRIEND_ATTRIBUTES = 'id username'

// const requestFriendship = function (user) {
//   return Friendship.request(this.id, user.id)
// }
//
// const acceptFriendship = function (user) {
//   return Friendship.accept(this.id, user.id)
// }
//
// const declineFriendship = function (user) {
//   return Friendship.decline(this.id, user.id)
// }
//
// const banFriendship = function (user) {
//   return Friendship.ban(this.id, user.id)
// }
//
// const getFriends = function () {
//   return Friendship.getFriends(this.id)
// }

const toFriend = function () {
  return {
    id: this.id,
    username: this.username
  }
}

const toJSON = profile => ({
  id: profile.id,
  userId: profile.userId,

  firstName: profile.firstName,
  lastName: profile.lastName,
  fullName: profile.fullName,
  country: profile.country,
  website: profile.website,
  twitter: profile.twitter,

  // friends: this.friends,
  // friendRequests: this.friendRequests,
  // favorites: this.favorites,
  // bannedFriends: this.bannedFriends,

  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt
})

const ProfileSchema = function (sequelize, DataTypes) {
  const Profile = sequelize.define('Profile', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },

    // TODO: Possibly validate country name based on a static list. Would need
    // to be updated when country names change, are added, or removed.
    country: { type: DataTypes.STRING },

    website: {
      type: DataTypes.STRING,
      // validate: {
      //   isUrl: {
      //     msg: 'Must be valid URL.'
      //   }
      // }
    },
    twitter: { type: DataTypes.STRING }
  },
  {
    name: {
      singular: 'profile',
      plural: 'profiles'
    },
    tableName: 'Profiles',
    getterMethods: {
      fullName: function () {
        const noSpace = !this.firstName || !this.lastName
        return `${ this.firstName || '' }${ noSpace ? '' : ' ' }${ this.lastName || '' }`
      }
    },
    setterMethods: {
      // Extract firstName and lastName from a single fullName value.
      fullName: function (name) {
        const names = name.split(' ')
        this.setDataValue('firstName', names.slice(0, -1).join(' '))
        this.setDataValue('lastName', names.slice(-1).join(' '))
      }
    },
    instanceMethods: {
      toJSON: function () {
        return toJSON(this.get())
      }
    }
  })

  return Profile
}

module.exports = ProfileSchema
