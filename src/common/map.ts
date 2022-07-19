/* eslint-disable prettier/prettier */
import axios from 'axios';
import { envglobals } from './envglobals';
import { LatLngBounds } from 'leaflet';
import screenfull from 'screenfull';

const EnvGlobals = envglobals(); 

// LCC map options
// ! Map bounds doesn't work for projection other then Web Mercator
const lccMapOptionsParam: MapOptions = {
    zoomFactor: 7,
    minZoom: 3,
    maxZooom: 19,
};

// Web Mercator map options
const wmMapOptionsParam: MapOptions = {
    zoomFactor: 5,
    minZoom: 2,
    maxZooom: 19,
    maxBounds: new LatLngBounds({ lat: -89.999, lng: -180 }, { lat: 89.999, lng: 180 }),
    maxBoundsViscosity: 0.0,
};

export function getMapOptions(epsgCode: number): MapOptions {
    return epsgCode === 3978 ? lccMapOptionsParam : wmMapOptionsParam;
}

export interface MapOptions {
    zoomFactor: number;
    minZoom: number;
    maxZooom: number;
    maxBounds?: LatLngBounds;
    maxBoundsViscosity?: number;
}

/**
 * Toggles fullscreen for the app.
 *
 * @memberof MapInstance
 */
export function toggleFullscreen(element: HTMLElement): void {
    if (screenfull.isEnabled) {
        // TODO: check if needed
        // DomUtil.hasClass(mapElem, 'leaflet-pseudo-fullscreen') ? DomUtil.removeClass(mapElem, 'leaflet-pseudo-fullscreen') : DomUtil.addClass(mapElem, 'leaflet-pseudo-fullscreen');
        // DomUtil.hasClass(mapElem, 'leaflet-fullscreen-on') ? DomUtil.removeClass(mapElem, 'leaflet-fullscreen-on') : DomUtil.addClass(mapElem, 'leaflet-fullscreen-on');

        // toogle fullscreen
        screenfull.toggle(element);
    }
}

const token = "eyJraWQiOiJQTEVxa1NpUW9MNXRDb1dNMSs3Tmw2SXJMbFpYUHR1WWRJSmxcL09SVzF3TT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiSFlBdDRpdGZPVkoxYlJJemMzZFFLZyIsInN1YiI6IjQ0Mjk0NDNlLTIwOGQtNDkxMC1hZjY5LTBjZTlmZDFlNjc4MCIsImNvZ25pdG86Z3JvdXBzIjpbImNhLWNlbnRyYWwtMV9pWnRxb0FRV0xfU2lnbi1pbi1DYW5hZGEiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmNhLWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9jYS1jZW50cmFsLTFfaVp0cW9BUVdMIiwiY29nbml0bzp1c2VybmFtZSI6IlNpZ24taW4tQ2FuYWRhX2ZhY2UwZDQwLWQyMTYtNGQwYi04NzkxLWRkZTY3NmIxODA1MyIsIm5vbmNlIjoiUnRGZi1QaDEwdEd3dDdLc3VnN0x3LTE1blU2d3I2NnlrRzFJck1Qb3RKbHVadXJkQ180Y2x3UnVOYnVRZ1JRQ2dwWDc3dHJWclRJSE5GeDNJRTEyZjBDN0FnaTdQTWoxZ3BKTTdVaWVYaDAwRm9Kek9EcWpYeE9yMHBBSVdHLTJSNy0tTm5leWFpZ0VjZVNuRElUNWdZOWEtYkNMbmZqbF85cHJ6U2t4RUlBIiwib3JpZ2luX2p0aSI6IjVkYTRiN2NiLWU4ZjYtNDVjZC04ZTkyLTg1OWQyZmMzNzI5YSIsImF1ZCI6IjJiZmtyYW9pM283NTNrNTR1cHZxNzRhbmdmIiwiaWRlbnRpdGllcyI6W3sidXNlcklkIjoiZmFjZTBkNDAtZDIxNi00ZDBiLTg3OTEtZGRlNjc2YjE4MDUzIiwicHJvdmlkZXJOYW1lIjoiU2lnbi1pbi1DYW5hZGEiLCJwcm92aWRlclR5cGUiOiJPSURDIiwiaXNzdWVyIjpudWxsLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTY1NjQzOTcyMTMxMyJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NTgyNDAxMzUsImV4cCI6MTY1ODI0MzczNSwiaWF0IjoxNjU4MjQwMTM1LCJqdGkiOiI4MGNlYmFkNS1kMTQ2LTRiOWQtOWY3OS03YWViOTYyMWE5NzMifQ.Zie75DmEbEhwq1_dbVELaCgbL6HYH3InGvQYjSp87H9GBVpFKA6KFokqfW2FQ8fNhLrutufOXqL3TFC9K_eVi1vRTJPn_T5NlNevLN_8b0mCUMYwEkgMp725SzGbNGMTBygNZjEqwnV4P0LhKBX8kN0J74iai_E4i5fG_SceDFLHzATrqBqULIdeomx3YO-J-VCmCdWrHL2FACJ1ojEm1fS4PSLUq-bZMwz4fTUEj9a2s8qvuIqjdSLUR-MZjIOQ_CWO-7rOcLyriTayh-YEdxQYmklU3606-YXbnXNTXpAy4XAjlGZNO7t3MCA9KApAiNMkYn-mi1yStLfd5f0reg"

export async function mapCartPost(maps): void {
    console.log("posting a map cart...")
    const headers = { headers: {"Authorization": "Bearer " + token}}
    axios.put(`${EnvGlobals.APP_API_DOMAIN_URL}${EnvGlobals.APP_API_ENDPOINTS.MAP}`, {
        firstName: 'Fred',
        lastName: 'Flintstone',
        mapCart: 'itsalmapcart'
      }, headers)
      .then(function (response) {
        console.log(response);
        // return response;
      })
      .catch(function (error) {
        console.log(error);
        // return error;
      });
    const res = await userGet()
    return res
}

export async function userGet() {
    console.log("getting user..")
    const headers = { headers: {Authorization: "Bearer " + token}}
     axios.get(`${EnvGlobals.APP_API_DOMAIN_URL}${EnvGlobals.APP_API_ENDPOINTS.MAP}`, headers)
      .then(function (response) {
        console.log(response);
        return response;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });
}   
// }
