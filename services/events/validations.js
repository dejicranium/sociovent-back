module.exports = {
    create(data) {
        if (data.venue) {
            if (!['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'twitch'].includes(data.venue.toLowerCase())) {
                throw new Error("Venue not supported");
            }
        }
    }
}