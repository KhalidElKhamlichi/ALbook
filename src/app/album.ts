import { Photo } from './photo';

export class Album {
    private _id: string;
    private _name: string;
    private _coverPhoto: Photo;
    private _totalPhotos: number;

	constructor(id: string, name: string, photo: Photo, totalPhotos: number) {
		this._id = id;
		this._name = name;
        this._coverPhoto = photo;
        this._totalPhotos = totalPhotos;
    }

	get id(): string {
		return this._id;
    }

    get name(): string {
		return this._name;
	}
    
    get coverPhoto(): Photo {
        return this._coverPhoto;
    }

    get totalPhotos(): number {
        return this._totalPhotos;
    }
}
