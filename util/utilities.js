function formatMessageDate(dateString) {
	const options = {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: 'short'
	};

	const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
	return formattedDate;
}
