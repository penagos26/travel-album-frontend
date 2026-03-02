export interface Place {
	id: string;
	cityName: string;
	location: {
		lat: number;
		lng: number;
	};
	photoUrl: string;
	visitDate: string;
	rating: number;
	musicUrl?: string;
}