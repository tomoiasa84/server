import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    _id: String,
    emailAddresses: {
        type: Array,
        defaultValue: []
    },
    'emailAddresses.$': {
        type: Object,
        blackbox: true
    },
    company: String,
    familyName: String,
    givenName: String,
    jobTitle: String,
    middleName: String,
    phoneNumbers: {
        type: Array,
        defaultValue: []
    },
    'phoneNumbers.$': {
        type: Object,
        blackbox: true
    },
    hasThumbnail: Boolean,
    thumbnailPath: String,
    postalAddresses: {
        type: Array,
        defaultValue: []
    },
    'postalAddresses.$': {
        type: Object,
        blackbox: true
    },
    birthday: {
        type: Object,
        blackbox: true
    },
    tags: {
        type: Array,
        defaultValue: []
    },
    'tags.$': {
        type: String,
        blackbox: true
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if ( this.isInsert ) {
                return new Date;
            }
        }
    }
}, { requiredByDefault: false });