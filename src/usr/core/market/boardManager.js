import keyBy from 'lodash/keyBy';
import intersection from 'lodash/intersection';
import * as restClient from '../utils/restClient';
import * as constants from '../../../commons/constants';

let newProjects = [];

export async function getAllProjects(projectsType, searchLang) {
  let fileData;
  if (projectsType === constants.MARKET_NEW_PROJECTS_TYPE) {
    fileData = await restClient.getRaw('/repos/webcodesk/webcodesk/contents/new-projects.json');
  } else if (projectsType === constants.MARKET_NEW_PACKAGES_TYPE) {
    fileData = await restClient.getRaw('/repos/webcodesk/webcodesk/contents/new-packages.json');
  }
  if (fileData) {
    newProjects = fileData.projectList || [];
  }
  let foundProjects = [];
  if (newProjects && newProjects.length > 0) {
    foundProjects = newProjects.filter(projectItem => projectItem.lang === searchLang);
  }
  return foundProjects;
}

export async function findProject(searchValues, searchLang) {
  let foundProjects = [];
  if (newProjects && newProjects.length > 0 && searchValues && searchValues.length > 0 && searchLang) {
    foundProjects = newProjects.filter(projectItem => {
      if (projectItem) {
        if (projectItem.keywords && projectItem.keywords.length > 0) {
          const intersectedKeywords = intersection(searchValues, projectItem.keywords);
          return projectItem.lang === searchLang && intersectedKeywords && intersectedKeywords.length > 0
        }
      }
      return false;
    });
  }
  return foundProjects;
}

export async function getSearchTagsList() {
  let searchTagsList = [];
  if (newProjects && newProjects.length > 0) {
    let tagsMap = {};
    newProjects.forEach(projectItem => {
      if (projectItem && projectItem.keywords && projectItem.keywords.length > 0) {
        tagsMap = {...tagsMap, ...keyBy(projectItem.keywords)};
      }
    });
    searchTagsList = Object.keys(tagsMap).map(tagKey => {
      return {
        value: tagKey,
      }
    });
  }
  return searchTagsList;
}

export async function getProjectDetails(projectModel) {
  let marketProjectViewData = {};
  if (projectModel) {
    marketProjectViewData = {projectModel};
    if (projectModel.projectRepository) {
      const projectReadmeContent = await restClient.getRaw(
        `/repos/${projectModel.projectRepository}/contents/README.md`
      );
      if (projectReadmeContent) {
        if (projectReadmeContent.content) {
          marketProjectViewData.projectReadmeContent = window.atob(projectReadmeContent.content);
        } else {
          marketProjectViewData.projectReadmeContent = projectReadmeContent;
        }
      } else {
        marketProjectViewData.projectReadmeContent = '### Project README.md is not found'
      }
      marketProjectViewData.projectSourceCodeURL =
        `${constants.URL_GITHUB}/${projectModel.projectRepository}`;
    }
  }
  return marketProjectViewData;
}
