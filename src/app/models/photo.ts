export class Photo {
    
    private _id: string;
    private _source: string;

	constructor(id: string, source: string) {
		this._id = id;
		this._source = source;
	}
    
	get id(): string {
		return this._id;
	}

	get source(): string {
		return this._source;
	}

}
