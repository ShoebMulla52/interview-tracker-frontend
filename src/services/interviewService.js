import api from './api';

const interviewService = {

  getAllInterviews: async (
    page = 0,
    size = 10,
    sortBy = 'interviewDate',
    direction = 'desc'
  ) => {
    const response = await api.get('/interviews', {
      params: {
        page,
        size,
        sortBy,
        direction,
      },
    });

    return response.data;
  },

  getInterviewById: async (id) => {
    const response = await api.get(`/interviews/${id}`);

    return response.data;
  },

  createInterview: async (interviewData) => {
    const response = await api.post(
      '/interviews',
      interviewData
    );

    return response.data;
  },

  updateInterview: async (id, interviewData) => {
    const response = await api.put(
      `/interviews/${id}`,
      interviewData
    );

    return response.data;
  },

  // Candidate Search
  searchByCandidate: async (
    candidateName,
    page = 0,
    size = 10
  ) => {

    const response = await api.get(
      '/interviews/search/candidate',
      {
        params: {
          name: candidateName,
          page,
          size,
        },
      }
    );

    return response.data;
  },

  // Company Search
  searchByCompany: async (
    companyName,
    page = 0,
    size = 10
  ) => {

    const response = await api.get(
      '/interviews/search/company',
      {
        params: {
          name: companyName,
          page,
          size,
        },
      }
    );

    return response.data;
  },

  // Status Filter
  filterByStatus: async (
    status,
    page = 0,
    size = 10
  ) => {

    const response = await api.get(
      '/interviews/filter/status',
      {
        params: {
          status,
          page,
          size,
        },
      }
    );

    return response.data;
  },

  // Mode Filter
  filterByMode: async (
    mode,
    page = 0,
    size = 10
  ) => {

    const response = await api.get(
      '/interviews/filter/mode',
      {
        params: {
          mode,
          page,
          size,
        },
      }
    );

    return response.data;
  },

  // Date Filter
  filterByDate: async (
    startDate,
    endDate,
    page = 0,
    size = 10
  ) => {

    const response = await api.get(
      '/interviews/filter/date',
      {
        params: {
          startDate,
          endDate,
          page,
          size,
        },
      }
    );

    return response.data;
  },

  // Delete
  deleteInterview: async (id) => {

    const response = await api.delete(
      `/interviews/${id}`
    );

    return response.data;
  },

};

export default interviewService;