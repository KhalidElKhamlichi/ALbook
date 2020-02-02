import { Photo } from './photo';
import { AlbumSource } from './album-source.enum';

export class Album {
    private _id: string;
    private _name: string;
    private _coverPhoto: Photo;
    private _totalPhotos: number;
    private _source: AlbumSource;

	constructor(id: string, name: string, photo: Photo, totalPhotos: number, source: AlbumSource) {
		this._id = id;
		this._name = name;
        this._coverPhoto = photo;
        this._totalPhotos = totalPhotos;
        this._source = source;
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
    
    get source(): AlbumSource {
        return this._source;
    }
}
