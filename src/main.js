const fs = require( 'graceful-fs' )
const path = require( 'path' )

const mkdirp = require( 'mkdirp' )
const rimraf = require( 'rimraf' )
const got = require( 'got' )

module.exports = { download, bundle, install }

function debug ( text ) {
}

function init ()
{
	const unpkgPath = path.join( process.cwd(), 'websack' )
	const pkgPath = path.join( process.cwd(), 'package.json' )

	// console.log( 'pkgPath: ' + pkgPath )

	const pkg = require( pkgPath )
	if ( !pkg ) throw new Error( `package.json not find in cwd: ${ pkgPath }` )

	if ( !pkg.websack ) {
		console.log( `error: no "websack" field found in package.json.` )
		console.log( 'Exiting' )
		return process.exit( 1 )
	}

	if ( Array.isArray( typeof pkg.websack  )) {
		console.log( `error: "websack" was an array instead of an object` )
		console.log(
			`
			example package.json config:
			"websack": {
				"dev": {
					"react": "https://unpkg.com/react@16.7.0/umd/react.development.js",
					"react-dom": "https://unpkg.com/react-dom@16.7.0/umd/react-dom.development.js"
				},
				"prod": {
					"react": "https://unpkg.com/react@16.7.0/umd/react.production.min.js",
					"react-dom": "https://unpkg.com/react-dom@16.7.0/umd/react-dom.production.min.js"
				}
			}
			`.split( os.EOL ).map( line => line.slice( 3 ) ).join( os.EOL )
		)
		console.log( 'Exiting' )
		return process.exit( 1 )
	}

	return {
		unpkgPath, pkg, pkgPath
	}
}

async function download ()
{
	const { unpkgPath, pkg, pkgPath } = init()

	// clean dir
	rimraf.sync( unpkgPath )
	mkdirp.sync( unpkgPath )

	for ( let dest in pkg.websack ) {
		await processField( dest, pkg.websack, unpkgPath )
	}

	async function processField ( field, obj, dir ) {
		switch ( field ) {
			case 'bundle':
				// special name no need to download
				return
				break

			default:
		}

		const value = obj[ field ]
		if ( typeof value === 'object' ) {
			const dirpath = path.join( dir, field )

			debug( 'dirpath: ' + dirpath )
			mkdirp.sync( dirpath )

			for ( let lib in value ) {
				await processField( lib, value, dirpath )
			}
		} else {
			const url = value
			debug( 'url: ' + url )
			console.log( 'downloading: ' + url )
			let response
			try {
				response = await got( url )
			} catch ( err ) {
				console.log( err.message )
				process.exit( 1 )
			}
			const filename = fixFilename( field, [ url ] )
			const filepath = path.join( dir, filename )
			debug( 'filepath: ' + filepath )

			fs.writeFileSync( filepath, response.body )
			console.log( ' file saved: ' + path.relative( process.cwd(), filepath ) )
		}
	}
}

async function bundle ()
{
	const { unpkgPath, pkg, pkgPath } = init()

	const bundleDirPath = path.join( unpkgPath, 'bundles' )
	// clean dir
	rimraf.sync( bundleDirPath )
	mkdirp.sync( bundleDirPath )

	const bundles = {}

	for ( let dest in pkg.websack ) {
		await processField( dest, pkg.websack, unpkgPath )
	}

	if ( Object.keys( bundles ).length < 1 ) {
		console.log( `no bundle fields were found configured.` )
		console.log( `try "websack help" for an example` )
		process.exit( 1 )
	}

	for ( let bundle in bundles ) {
		const bundleText = bundles[ bundle ].join( ';\n' )
		const bundlePath = path.join( bundleDirPath, bundle )
		fs.writeFileSync( bundlePath, bundleText )
		console.log( `bundle saved: ${ path.relative( process.cwd(), bundlePath ) }` )
	}

	async function processField ( field, obj, dir, bundleName ) {
		const value = obj[ field ]
		if ( typeof value === 'object' ) {
			const dirpath = path.join( dir, field )

			let bundleName
			for ( let lib in value ) {
				switch ( lib ) {
					case 'bundle':
						bundleName = value[ lib ]
						break

					default:
						// bundle only files after bundle was defined
						if ( bundleName ) {
							await processField( lib, value, dirpath, bundleName )
						} else {
							const filename = fixFilename( lib, [ value[ lib ] ] )
							const filepath = path.join( dirpath, filename )
							console.log(
								'skipping: ' + path.relative( process.cwd(), filepath )
							)
						}
				}
			}
		} else {
			const url = value
			const filename = fixFilename( field, [ url ] )
			const filepath = path.join( dir, filename )
			debug( 'filepath: ' + filepath )
			const text = fs.readFileSync( filepath, 'utf8' )

			// init bundle if it doesn't exist
			bundles[ bundleName ] = bundles[ bundleName ] || []
			// add this text to the bundle
			bundles[ bundleName ].push( text )
		}
	}
}

async function install ()
{
	await download()
	await bundle()
}

/**
 * Resolve appropriate suffix ( ex: .min.js or .js ) information to the filename.
 * @param {string} filename - obj property name found in package.json
 * @param {string[]} list   - list of targets to search for suffix
 */
function fixFilename ( filename, list = [] )
{
	// already has suffix, do nothing
	if ( /\w+\.\w+$/.test( filename ) ) return filename

	for ( let i = 0; i < list.length; i++ ) {
		const target = list[ i ]

		let r
		// get .min.* ( ex: .min.js ) from target
		r = target.match( /\w+(\.min\.\w+)$/ )
		if ( r && r[ 1 ] ) return filename + r[ 1 ]

		// get .* ( ex: .js ) from target
		r = target.match( /\w+(.\w+)$/ )
		if ( r && r[ 1 ] ) return filename + r[ 1 ]
	}

	// didn't find any meaningful suffix, return as-is
	return filename
}
