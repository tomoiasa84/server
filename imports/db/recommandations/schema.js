import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    _id: String,
    tags: {
        type: Array,
        defaultValue: []
    },
    'tags.$': {
        type: String,
        blackbox: true
    },
    text: String,
    commentIds: {
        type: Array
    },
    'commentIds.$': {
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