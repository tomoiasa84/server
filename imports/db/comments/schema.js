import SimpleSchema from 'simpl-schema';
export default new SimpleSchema({
    _id: String,
    recommandationId: String,
    createdAt: {
        type: Date,
        autoValue: function() {
            if ( this.isInsert ) {
                return new Date;
            }
        }
    }
}, { requiredByDefault: false });