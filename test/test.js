var testsContext = require.context(".", true, /chrome__test$/);

testsContext.keys().forEach(testsContext);