import { Toast } from 'native-base';

import {
    SIGN_UP,
    SIGN_IN,
    STORE_HISTORY,
    GET_SITETAGS,
    STORE_TAG,
    REMOVE_TAG,
    UPDATE_ACTIVE,
    UPDATE_SITENAME,
    HANDLE_FOOTERTAB,
    SHOW_TAG,
    SHOW_PROGRESS,
    SEARCH_HISTORY,
    SEARCH_TAGS,
    NEW_TAB,
    SWITCH_TAB,
    REMOVE_TAB,
    STORE_TABHISTORY,
    BACK_TABHISTORY,
    FORWARD_TABHISTORY,
    SET_CONTEXT
} from '../constants/userTypes';

const initialState = {
    user: {},
    siteTags:[],
    tag:{
        name:'',
        sites:[]
    },
    search:[],
    searchTags:[],
    tabs:[
        {
            url:'https://duckduckgo.com/',
            siteName: 'DuckDuckGo -- Privacy, simplified.',
            history:['https://duckduckgo.com/'],
            activeHistory:0
        }
    ],
    activeTab:0,
    footerTab:0,
    toast:'',
    progress: {
        show:false,
        data:0
    },
    contextData: {
        src:'',
        text:'',
        href:''
    }
};

export default (state = initialState, action) => {
    switch(action.type) {

        case SIGN_UP: {
            return {
                ...state,
                user: action.json.user
            }
        }

        case SIGN_IN: {
            return {
                ...state,
                user: action.json.user
            }
        }

        case STORE_HISTORY: {
            let user = state.user;
            let siteCheck = false;

            user.sites.forEach((site, i) => {
                if(site.url === action.site) {
                    site.lastVisit = new Date();
                    user.sites.unshift(user.sites.splice(i, 1)[0]);
                    siteCheck = true;
                }
            })

            if(siteCheck === false) {
                let newSite = {
                    url: action.site,
                    siteName: action.siteName,
                    firstVisit: new Date(),
                    lastVisit: new Date(),
                    tags: []
                };

                user.sites.unshift(newSite);
            };
            

            return {
                ...state,
                user
            }
        }

        case GET_SITETAGS: {
            let user = state.user;
            let siteTags = [];
            let siteCheck = false;
            user.sites.forEach((site, i) => {
                if(site.url === action.url) {
                    siteTags = site.tags;
                    siteCheck = true;
                }
            });

            if(siteCheck === false) {
                siteTags = [];
            }

            return {
                ...state,
                siteTags
            }
        }

        case STORE_TAG: {
            let user = state.user;
            let tagCheck = false;

            user.sites.forEach((site, i) => {
                if(site.url === action.site) {
                    if(site.tags.includes(action.tag)) {

                    } else {
                        site.tags.unshift(action.tag);
                    }
                }
            })

            user.tags.forEach((tag, i) => {
                if(tag.name === action.tag) {
                    tag.count++;
                    tagCheck = true;
                }
            })

            if(tagCheck === false) {
                let newTag = {
                    name: action.tag,
                    count: 1,
                    svg: {fill:'#1abc9c'}
                };

                user.tags.unshift(newTag);
            }

            return {
                ...state,
                user
            }
        }

        case REMOVE_TAG: {
            let user = state.user;

            user.sites.forEach((site, i) => {
                if(site.url === action.site) {
                    site.tags.splice(site.tags.indexOf(action.tag), 1);
                }
            });

            user.tags.forEach((tag, i) => {
                if(tag.name === action.tag) {
                    if(tag.count === 0) {
                        user.tags.splice(i, 1);
                    }
                }
            });

            return {
                ...state,
                user
            }
        }

        case SHOW_TAG: {
            let user = state.user;
            let tag = state.tag;

            tag.name = action.tag;
            tag.sites = [];

            user.sites.forEach((site, i) => {
                if(site.tags.includes(action.tag)) {
                    tag.sites.push(site);
                }
            })

            return {
                ...state,
                user,
                tag
            }
        }

        case SHOW_PROGRESS: {
            return {
                ...state,
                progress: action.data
            }
        }

        case SEARCH_HISTORY: {
            let user = state.user;
            let search = state.search;

            search = [];
            if(action.query !== "") {
                user.sites.forEach((site, i) => {
                    if(site.url.search(action.query) >= 0) {
                        search.push(site);
                    }
                });
            }

            return {
                ...state,
                search
            }
        }

        case SEARCH_TAGS: {
            let user = state.user;
            let searchTags = state.searchTags;

            searchTags = [];

            if(action.query !== "") {
                user.tags.forEach((tag, i) => {
                    if(tag.name.toLowerCase().search(action.query.toLowerCase()) >= 0) {
                        searchTags.push(tag);
                    }
                });
            }

            return {
                ...state,
                searchTags
            }
        }

        case UPDATE_ACTIVE: {
            let tabs = state.tabs;
            let activeTab = state.activeTab;
            if(tabs[activeTab].url !== action.url) {
                tabs[activeTab].url = action.url;
            }

            return {
                ...state,
                tabs
            }
        }

        case UPDATE_SITENAME: {
            let tabs = state.tabs;
            let activeTab = state.activeTab;
            tabs[activeTab].siteName = action.siteName;

            return {
                ...state,
                tabs
            }
        }

        case HANDLE_FOOTERTAB: {
            let footerTab = state.footerTab;
            if(footerTab === action.index) {
                footerTab = 0;
            } else {
                footerTab = action.index;
            }
            return {
                ...state,
                footerTab
            }
        }

        case NEW_TAB: {
            let tabs = state.tabs;
            let activeTab = state.activeTab;

            let newTab = {
                url:'https://duckduckgo.com/',
                siteName: 'DuckDuckGo -- Privacy, simplified.',
                history:['https://duckduckgo.com/'],
                activeHistory:0
            };

            if(action.url !== null) {
                newTab.url = action.url;
                newTab.siteName = '';
                newTab.history = [action.url];
                newTab.activeHistory = 0;
            }

            tabs.unshift(newTab);

            activeTab = 0;

            return {
                ...state,
                tabs,
                activeTab
            }
        }

        case SWITCH_TAB: {
            let tabs = state.tabs;
            let activeTab = state.activeTab;

            activeTab = action.index;

            return {
                ...state,
                activeTab
            }
        }

        case REMOVE_TAB: {
            let tabs = state.tabs;
            let activeTab = state.activeTab;

            tabs.splice(action.index, 1);

            if(tabs.length === 0) {
                let newTab = {
                    url:'https://duckduckgo.com/',
                    siteName: 'DuckDuckGo -- Privacy, simplified.',
                    history:['https://duckduckgo.com/'],
                    activeHistory:0
                };

                tabs.unshift(newTab);
                activeTab = 0;
            } else {
                if(activeTab === action.index) { 
                    if(activeTab - 1 < 0) {
                        activeTab = 0;
                    } else {
                        activeTab--;
                    }
                } else {
                    if(activeTab > 0 && action.index < activeTab) {
                        activeTab--;
                    }
                }
            }

            return {
                ...state,
                activeTab,
                tabs
            }
        }

        case STORE_TABHISTORY: {
            let tabs = state.tabs;
            let activeTab = state.activeTab;

            if(action.url !== tabs[activeTab].history[tabs[activeTab].activeHistory]) {
                tabs[activeTab].history.unshift(tabs[activeTab].history.splice(tabs[activeTab].activeHistory, 1)[0]);

                tabs[activeTab].history.unshift(action.url);
                tabs[activeTab].activeHistory = 0;

                return {
                    ...state,
                    tabs
                }
            } else {
                return {
                    ...state
                }
            }

        }

        case BACK_TABHISTORY: {
            let tabs = state.tabs;
            let activeTab = state.activeTab;

            if(action.index === -1) {
                if(tabs[activeTab].history.length > 0) {
                    tabs[activeTab].activeHistory++;
                    tabs[activeTab].url = tabs[activeTab].history[tabs[activeTab].activeHistory];
                }
            } else {
                tabs[activeTab].activeHistory = action.index;
                tabs[activeTab].url = tabs[activeTab].history[action.index];
            }

            return {
                ...state,
                tabs
            }
        }

        case FORWARD_TABHISTORY: {
            let tabs = state.tabs;
            let activeTab = state.activeTab;

            if(action.index === -1) {
                if(tabs[activeTab].activeHistory - 1 >= 0 ) {
                    tabs[activeTab].activeHistory--;
                    tabs[activeTab].url = tabs[activeTab].history[tabs[activeTab].activeHistory];
                }
            } else {
                tabs[activeTab].activeHistory = action.index;
                tabs[activeTab].url = tabs[activeTab].history[action.index];
            }

            return {
                ...state,
                tabs
            }
        }

        case SET_CONTEXT: {
            let contextData = state.contextData;

            contextData = action.data;

            return {
                ...state,
                contextData
            }
        }

        default: {
            return state;
        }
    }
}

