module.exports = {
  before(browser) {
    browser.resizeWindow(1600, 1000);

    const login = browser.page.login();

    const reportPage = browser.page.report();

    login
      .navigate(reportPage.url())
      .loginAsRoot();

    browser.expect.url().to.equal(reportPage.url()).before(5000);

    reportPage
      .waitForElementVisible("@page", 10000)
      .waitForProgressBarNotPresent();

    [
      reportPage.section.baselineRunFilter,
      reportPage.section.baselineTagFilter,
      reportPage.section.filePathFilter,
      reportPage.section.checkerNameFilter,
      reportPage.section.severityFilter,
      reportPage.section.reviewStatusFilter,
      reportPage.section.detectionStatusFilter,
      reportPage.section.sourceComponentFilter,
      reportPage.section.checkerMessageFilter,
      reportPage.section.checkerMessageFilter,
      reportPage.section.detectionDateFilter,
      reportPage.section.reportHashFilter,
      reportPage.section.bugPathLengthFilter
    ].forEach(section => {
      section.click("@expansionBtn");
    });
  },

  after(browser) {
    browser.perform(() => {
      browser.end();
    });
  },

  "clear all filters" (browser) {
    const reportPage = browser.page.report();

    reportPage.click("@clearAllFilterBtn");
    reportPage
      .pause(500)
      .waitForElementNotPresent("@progressBar");

    [
      reportPage.section.baselineRunFilter,
      reportPage.section.baselineTagFilter,
      reportPage.section.filePathFilter,
      reportPage.section.checkerNameFilter,
      reportPage.section.severityFilter,
      reportPage.section.reviewStatusFilter,
      reportPage.section.detectionStatusFilter,
      reportPage.section.sourceComponentFilter,
      reportPage.section.checkerMessageFilter
    ].forEach(section => {
      section.api.elements("@selectedItems", ({result}) => {
        browser.assert.ok(result.value.length === 0);
      });
    });
  },

  "sort reports by bug path length" (browser) {
    const reportPage = browser.page.report();

    // Sort reports in ascending order by bug path length.
    reportPage.sortReports(6, (data) => {
      return data.every((e, ind, a) =>
        !ind || parseInt(a[ind - 1][5]) <= parseInt(e[5]));
    });

    // Sort reports in descending order by bug path length.
    reportPage.sortReports(6, (data) => {
      return data.every((e, ind, a) =>
        !ind || parseInt(a[ind - 1][5]) >= parseInt(e[5]));
    });
  },

  "uniqueing reports" (browser) {
    const reportPage = browser.page.report();

    reportPage
        .click("@uniqueReports")
        .waitForProgressBarNotPresent()
        .click("@expandBtn");

    reportPage.expect.section("@expanded").to.be.visible.before(5000);
  },

  "set and clear baseline run filter" (browser) {
    const reportPage = browser.page.report();
    const section = reportPage.section.baselineRunFilter;

    section.openFilterSettings();

    reportPage.section.settingsMenu
      .search("simple")
      .click("@item")
      .search("macro")
      .click("@item")
      .applyFilter();

    section.closeFilterSettings(section);

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 2);
    });

    section.selectedItemClick(0);

    reportPage.waitForProgressBarNotPresent();

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 1);
    });

    section.click("@clearBtn");

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 0);
    });
  },

  "set baseline run filter" (browser) {
    const reportPage = browser.page.report();
    const section = reportPage.section.baselineRunFilter;

    section.openFilterSettings();

    reportPage.section.settingsMenu
      .search("*")
      .click("@regexItem")
      .applyFilter();

    section.closeFilterSettings();

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 1);
    });
  },

  "set baseline tag filter" (browser) {
    const reportPage = browser.page.report();
    const section = reportPage.section.baselineTagFilter;

    section.openFilterSettings();

    reportPage.section.settingsMenu
      .search("*")
      .click("@regexItem")
      .applyFilter();

    section.closeFilterSettings();

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 1);
    });
  },

  "open compare to expansion panel" (browser) {
    const reportPage = browser.page.report();
    const compareToSection = reportPage.section.compareToFilters;

    reportPage.click(compareToSection);
    compareToSection.expect.section("@compareToRunFilter")
      .to.be.visible.before(5000);

    [
      compareToSection.section.compareToRunFilter,
      compareToSection.section.compareToTagFilter,
      compareToSection.section.compareToDiffTypeFilter,
    ].forEach(section => {
      section.click("@expansionBtn");
    });
  },

  async "set compare to run filter" (browser) {
    const reportPage = browser.page.report();
    const compareToSection = reportPage.section.compareToFilters;
    const section = compareToSection.section.compareToRunFilter;

    const res = await compareToSection.api.element("@active");
    if (res.status === -1) {
      reportPage.click(compareToSection);
      compareToSection.expect.section("@compareToRunFilter")
        .to.be.visible.before(5000);
    }

    section.openFilterSettings();

    reportPage.section.settingsMenu
      .search("*")
      .click("@regexItem")
      .applyFilter();

    section.closeFilterSettings();

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 1);
    });
  },

  async "set compare to tag filter" (browser) {
    const reportPage = browser.page.report();
    const compareToSection = reportPage.section.compareToFilters;
    const section = compareToSection.section.compareToTagFilter;

    const res = await compareToSection.api.element("@active");
    if (res.status === -1) {
      reportPage.click(compareToSection);
      compareToSection.expect.section("@compareToTagFilter")
        .to.be.visible.before(5000);
    }

    section.openFilterSettings();

    reportPage.section.settingsMenu
      .search("*")
      .click("@regexItem")
      .applyFilter();

    section.closeFilterSettings();

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 1);
    });
  },

  async "set compare to diff type" (browser) {
    const reportPage = browser.page.report();
    const compareToSection = reportPage.section.compareToFilters;
    const section = compareToSection.section.compareToDiffTypeFilter;

    const res = await compareToSection.api.element("@active");
    if (res.status === -1) {
      reportPage.click(compareToSection);
      compareToSection.expect.section("@compareToDiffTypeFilter")
        .to.be.visible.before(5000);
    }

    section.openFilterSettings();

    reportPage.section.settingsMenu
      .toggleMenuItem(2)
      .applyFilter();

    section.closeFilterSettings();

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 1);
    });
  },

  "set file path filter" (browser) {
    const reportPage = browser.page.report();
    const section = reportPage.section.filePathFilter;

    section.openFilterSettings();

    reportPage.section.settingsMenu
      .search("*")
      .click("@regexItem")
      .applyFilter();

    section.closeFilterSettings();

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 1);
    });
  },

  "set checker name filter" (browser) {
    const reportPage = browser.page.report();
    const section = reportPage.section.checkerNameFilter;

    section.openFilterSettings();

    reportPage.section.settingsMenu
      .search("*")
      .click("@regexItem")
      .applyFilter();

    section.closeFilterSettings();

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 1);
    });
  },

  "set severity filter" (browser) {
    const reportPage = browser.page.report();
    const section = reportPage.section.severityFilter;

    section.openFilterSettings();

    reportPage.section.settingsMenu
      .toggleMenuItem(3)
      .toggleMenuItem(4)
      .toggleMenuItem(5)
      .applyFilter();

    section.closeFilterSettings();

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 3);
    });
  },

  "set review status filter" (browser) {
    const reportPage = browser.page.report();
    const section = reportPage.section.reviewStatusFilter;

    section.openFilterSettings();

    reportPage.section.settingsMenu
      .toggleMenuItem(0)
      .toggleMenuItem(1)
      .toggleMenuItem(2)
      .toggleMenuItem(3)
      .applyFilter();

    section.closeFilterSettings();

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 4);
    });
  },

  "set detection status filter" (browser) {
    const reportPage = browser.page.report();
    const section = reportPage.section.detectionStatusFilter;

    section.openFilterSettings();

    reportPage.section.settingsMenu
      .toggleMenuItem(0)
      .toggleMenuItem(1)
      .toggleMenuItem(2)
      .applyFilter();

    section.closeFilterSettings();

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 3);
    });
  },

  "set source component filter" (browser) {
    const reportPage = browser.page.report();
    const section = reportPage.section.sourceComponentFilter;
    const dialogSection = reportPage.section.sourceComponentDialog;
    const newComponentDialog = reportPage.section.newSourceComponentDialog;
    const removeComponentDialog =
      reportPage.section.removeSourceComponentDialog;

    section.click("@manageBtn");

    reportPage.expect.section(dialogSection).to.be.visible.before(5000);

    dialogSection.pause(500);

    // Add a new component.
    dialogSection.waitForElementVisible("@newComponentBtn")
    dialogSection.click("@newComponentBtn");
    reportPage.expect.section(newComponentDialog).to.be.visible.before(5000);

    let [ name, value, description ] = [ "e2e", "+*", "Test" ];
    newComponentDialog
      .clearAndSetValue("@name", name, newComponentDialog)
      .clearAndSetValue("@value", value, newComponentDialog)
      .clearAndSetValue("@description", description, newComponentDialog)
      .click("@saveBtn");

    dialogSection.api.elements("@tableRows", (elements) => {
      browser.assert.ok(elements.result.value.length === 1);
    });

    // Edit component.
    dialogSection.click({ selector: "@editBtn", index: 0 });
    reportPage.expect.section(newComponentDialog).to.be.visible.before(5000);

    [ value, description ] = [ "+*\n-dummy", "Renamed" ];
    newComponentDialog
      .clearAndSetValue("@value", value, newComponentDialog)
      .clearAndSetValue("@description", description, newComponentDialog)
      .click("@saveBtn");

    dialogSection.api.elements("@tableRows", (elements) => {
      browser.assert.ok(elements.result.value.length === 1);
    });

    dialogSection.click("@closeBtn");

    // Select filter item.
    section.openFilterSettings();

    reportPage.section.settingsMenu
      .toggleMenuItem(0)
      .applyFilter();

    section.closeFilterSettings();

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 1);
    });

    // Clear the filter.
    section.click("@clearBtn");

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 0);
    });

    // Remove the component.
    section.click("@manageBtn");
    reportPage.expect.section(dialogSection).to.be.visible.before(5000);

    dialogSection.pause(500);

    dialogSection.waitForElementVisible("@removeBtn");
    dialogSection.click({ selector: "@removeBtn", index: 0 });
    reportPage.expect.section(removeComponentDialog)
      .to.be.visible.before(5000);

    removeComponentDialog.click("@confirmBtn");

    dialogSection
      .waitForElementVisible("@emptyTable")
      .click("@closeBtn");
  },

  "set checker message filter" (browser) {
    const reportPage = browser.page.report();
    const section = reportPage.section.checkerMessageFilter;

    section.openFilterSettings();

    reportPage.section.settingsMenu
      .search("*")
      .click("@regexItem")
      .applyFilter();

    section.closeFilterSettings();

    section.api.elements("@selectedItems", ({result}) => {
      browser.assert.ok(result.value.length === 1);
    });
  },

  "set detection date filters" (browser) {
    const reportPage = browser.page.report();
    const section = reportPage.section.detectionDateFilter;
    const fromDateDialog = reportPage.section.fromDetectionDateDialog;
    const toDateDialog = reportPage.section.toDetectionDateDialog;

    section.click("@from");
    reportPage.expect.section(fromDateDialog).to.be.visible.before(5000);

    fromDateDialog
      .click("@date")
      .click("@ok");

    section.click("@to");
    reportPage.expect.section(toDateDialog).to.be.visible.before(5000);

    toDateDialog
      .click("@date")
      .click("@ok");

    section.click("@clearBtn");

    reportPage
      .pause(500)
      .waitForElementNotPresent("@progressBar");
  },

  "set report hash filter" (browser) {
    const reportPage = browser.page.report();
    const section = reportPage.section.reportHashFilter;
    const reportHash = "***";

    section
      .clearAndSetValue("@reportHash", reportHash, section);

    reportPage
      .pause(500)
      .waitForElementNotPresent("@progressBar");
  },

  "set bug path length filters" (browser) {
    const reportPage = browser.page.report();
    const section = reportPage.section.bugPathLengthFilter;
    const minBugPathLen = 1;
    const maxBugPathLen = 10;

    section
      .clearAndSetValue("@min", minBugPathLen, section)
      .clearAndSetValue("@max", maxBugPathLen, section);

    reportPage
      .pause(500)
      .waitForElementNotPresent("@progressBar");
  },
}
