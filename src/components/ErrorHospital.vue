<template>
  <section class="section">
    <div class="container">
      <section>
        <b-field label="Data Center">
          <b-select placeholder="Select a data center" v-model="selectedDataCenter">
            <option v-for="dataCenter in dataCenters" :value="dataCenter" :key="dataCenter.name">
              {{ dataCenter.name }}
            </option>
          </b-select>
        </b-field>

        <b-field label="Errors JSON">
          <b-input
            type="textarea"
            v-model="errorsInput"
            placeholder="Please enter the errors JSON"
          ></b-input>
        </b-field>

        <div class="field">
          <b-checkbox v-model="excludeMFTFlag" size="is-medium">Exclude MFT errors</b-checkbox>
        </div>
        <div class="field">
          <b-checkbox v-model="excludePSPFlag" size="is-medium"
            >Exclude ECASE_DEC_FIELDPSP errors</b-checkbox
          >
        </div>
        <div class="field">
          <b-checkbox v-model="excludeValidationFlag" size="is-medium"
            >Exclude VALIDATION errors</b-checkbox
          >
        </div>
        <b-button type="is-primary" @click="parseErrors">Populate</b-button>
      </section>

      <section>
        <div class="columns">
          <div class="column">
            <b-field label="Results per page">
              <b-select v-model="perPage">
                <option value="10">10 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
                <option value="500">500 per page</option>
              </b-select>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Conversation ID">
              <b-select multiple v-model="selectedConversationIds" :disabled="allConversationIds">
                <option v-for="id in conversationIds" :key="id" :value="id">{{ id }}</option>
              </b-select>
            </b-field>
            <b-checkbox v-model="allConversationIds">Select all</b-checkbox>
          </div>
          <div class="column">
            <b-field label="Integration Name">
              <b-select multiple v-model="selectedIntegrationNames" :disabled="allIntegrationNames">
                <option v-for="name in integrationNames" :key="name" :value="name">{{
                  name
                }}</option>
              </b-select>
            </b-field>
            <b-checkbox v-model="allIntegrationNames">Select all</b-checkbox>
          </div>
          <div class="column">
            <b-field label="Sender">
              <b-select multiple v-model="selectedSenders" :disabled="allSenders">
                <option v-for="s in senders" :key="s" :value="s">{{ s }}</option>
              </b-select>
            </b-field>
            <b-checkbox v-model="allSenders">Select all</b-checkbox>
          </div>
          <div class="column">
            <b-field label="Target">
              <b-select multiple v-model="selectedTargets" :disabled="allTargets">
                <option v-for="t in targets" :key="t" :value="t">{{ t }}</option>
              </b-select>
            </b-field>
            <b-checkbox v-model="allTargets">Select all</b-checkbox>
          </div>
          <div class="column">
            <b-field label="Error Reason">
              <b-select multiple v-model="selectedErrorReasons" :disabled="allErrorReasons">
                <option v-for="r in errorReasons" :key="r" :value="r">{{
                  r | truncate(25)
                }}</option>
              </b-select>
            </b-field>
            <b-checkbox v-model="allErrorReasons">Select all</b-checkbox>
          </div>
        </div>

        <b-button type="is-primary" @click="resetFilters">Reset filters</b-button>

        <b-table
          :sort-multiple="true"
          hoverable
          detailed
          :narrowed="true"
          :paginated="true"
          :per-page="perPage"
          :current-page.sync="currentPage"
          ref="table"
          default-sort="errorDate"
          :data="computedErrors"
        >
          >
          <template slot-scope="props">
            <b-table-column field="selected" label="Selected">
              <b-checkbox
                @input="toggleSelectRow(props.row.errorGUID)"
                v-model="props.row.selected"
              ></b-checkbox>
            </b-table-column>
            <b-table-column field="conversationId" label="ConversationId" sortable>
              {{ props.row.conversationId }}
            </b-table-column>
            <b-table-column field="integrationName" label="Integration Name" sortable>
              {{ props.row.integrationName }}
            </b-table-column>
            <b-table-column field="sender" label="Sender" sortable>
              {{ props.row.sender }}
            </b-table-column>
            <b-table-column field="target" label="Target" sortable>
              {{ props.row.target }}
            </b-table-column>
            <b-table-column field="errorDate" label="Error Date" sortable>
              {{ props.row.errorDate }}
            </b-table-column>
            <b-table-column field="errorReason" label="Error Reason" sortable>
              {{ props.row.errorReason }}
            </b-table-column>
            <b-table-column field="retryCount" label="Retry Count" sortable>
              {{ props.row.retryCount }}
            </b-table-column>
          </template>

          <template slot="detail" slot-scope="props">
            <div class="columns">
              <div class="column">
                <b-button type="is-primary" class="is-small">Error GUID</b-button>&nbsp;{{
                  props.row.errorGUID
                }}
                <br />
                <br />

                <b-button type="is-primary" class="is-small">Error Code</b-button>&nbsp;{{
                  props.row.errorCode
                }}
                <br />
                <br />

                <b-button type="is-primary" class="is-small">Error Category</b-button>&nbsp;{{
                  props.row.errorCategory
                }}
                <br />
                <br />

                <b-button type="is-primary" class="is-small">Error Reason</b-button>&nbsp;{{
                  props.row.errorReason
                }}
                <br />
                <br />

                <b-button type="is-primary" class="is-small">Error Detail</b-button>&nbsp;{{
                  props.row.errorDetail
                }}
                <br />
                <br />
                <b-button type="is-primary" class="is-small">Retry Status</b-button>&nbsp;{{
                  props.row.retryStatus
                }}
              </div>

              <div class="column">
                <b-button type="is-primary" class="is-small">Retry Count</b-button>&nbsp;{{
                  props.row.retryCount
                }}
                <br />
                <br />

                <b-button type="is-primary" class="is-small">Retry Date</b-button>&nbsp;{{
                  props.row.retryDate
                }}
                <br />
                <br />

                <b-button type="is-primary" class="is-small">Kafka Topic</b-button>&nbsp;{{
                  props.row.kafkaTopic
                }}
                <br />
                <br />
                <b-button type="is-primary" class="is-small">Kafka Partition</b-button>&nbsp;{{
                  props.row.kafkaPartition
                }}
                <br />
                <br />
                <b-button type="is-primary" class="is-small">Kafka Offset</b-button>&nbsp;{{
                  props.row.kafkaOffset
                }}
                <br />
                <br />
                <b-button type="is-primary" class="is-small">Outbound URI</b-button>&nbsp;{{
                  props.row.outboundURI
                }}
              </div>
              <div class="column">
                <b-button type="is-primary" class="is-small">Protocol</b-button>&nbsp;{{
                  props.row.protocol
                }}
                <br />
                <br />
                <b-button type="is-primary" class="is-small">Target Format</b-button>&nbsp;{{
                  props.row.targetFormat
                }}
                <br />
                <br />
                <b-button type="is-primary" class="is-small">Target Security</b-button>&nbsp;{{
                  props.row.targetSecurity
                }}
                <br />
                <br />
                <b-button type="is-primary" class="is-small">Target Method</b-button>&nbsp;{{
                  props.row.targetMethod
                }}
                <br />
                <br />
                <b-button type="is-primary" class="is-small">Origin</b-button>&nbsp;{{
                  props.row.origin
                }}
              </div>
            </div>
          </template>

          <template slot="bottom-left">
            <b-button type="is-primary" @click="toggleCurrentPage(true)">{{
              "Select Current Page"
            }}</b-button>
            <b-button type="is-primary" @click="toggleCurrentPage(false)">{{
              "Clear Current Page"
            }}</b-button>

            <b-button type="is-primary" @click="toggleAllPages(true)">{{
              "Select All Pages"
            }}</b-button>
            <b-button type="is-primary" @click="toggleAllPages(false)">{{
              "Clear All Pages"
            }}</b-button>

            <b>Total checked</b>: {{ checkedRows.length }}
          </template>
        </b-table>

        <b-button type="is-primary" @click="generateAPICall">Generate API Call</b-button>
        <b-field label="API Call">
          <b-input
            type="textarea"
            v-model="apiCall"
            placeholder="Please select the data center or some errors to generate API call"
          ></b-input>
        </b-field>
      </section>
    </div>
  </section>
</template>

<script>
export default {
  name: "ErrorHospital",

  watch: {
    allConversationIds(allSelected) {
      if (allSelected) this.selectedConversationIds = [];
    },
    allIntegrationNames(allSelected) {
      if (allSelected) this.selectedIntegrationNames = [];
    },
    allSenders(allSelected) {
      if (allSelected) this.selectedSenders = [];
    },
    allTargets(allSelected) {
      if (allSelected) this.selectedTargets = [];
    },
    allErrorReasons(allSelected) {
      if (allSelected) this.selectedErrorReasons = [];
    }
  },

  computed: {
    computedErrors() {
      return this.originalErrors.filter(error => {
        return (
          (this.allConversationIds ||
            this.selectedConversationIds.includes(error.conversationId)) &&
          (this.allIntegrationNames ||
            this.selectedIntegrationNames.includes(error.integrationName)) &&
          (this.allSenders || this.selectedSenders.includes(error.sender)) &&
          (this.allTargets || this.selectedTargets.includes(error.target)) &&
          (this.allErrorReasons || this.selectedErrorReasons.includes(error.errorReason))
        );
      });
    },
    checkedRows() {
      return this.originalErrors.filter(error => error.selected);
    }
  },

  methods: {
    toggleSelectRow(errorGUID) {
      const idx = this.originalErrors.findIndex(error => error.errorGUID === errorGUID);
      let selectedError = this.originalErrors[idx];
      selectedError.selected = !selectedError.selected;
      this.$set(this.originalErrors, idx, selectedError);
    },
    resetFilters() {
      this.allConversationIds = true;
      this.allIntegrationNames = true;
      this.allSenders = true;
      this.allTargets = true;
      this.allErrorReasons = true;
    },
    toggleCurrentPage(flag) {
      let errorGUIDs = [];
      for (const x of Array.from(
        new Array(this.currentPage * this.perPage),
        (x, i) => i + (this.currentPage - 1) * this.perPage
      )) {
        if (!this.computedErrors[x]) {
          break;
        }
        errorGUIDs.push(this.computedErrors[x].errorGUID);
      }
      this.originalErrors = this.originalErrors.map(error => {
        if (errorGUIDs.includes(error.errorGUID)) {
          error.selected = flag;
        }
        return error;
      });
    },
    toggleAllPages(flag) {
      let errorGUIDs = this.computedErrors.map(error => error.errorGUID);

      this.originalErrors = this.originalErrors.map(error => {
        if (errorGUIDs.includes(error.errorGUID)) {
          error.selected = flag;
        }
        return error;
      });
    },
    parseErrors() {
      this.resetFilters();
      this.conversationIds = [];
      this.integrationNames = [];
      this.senders = [];
      this.targets = [];
      this.errorReasons = [];

      this.originalErrors = JSON.parse(this.errorsInput) || [];
      this.originalErrors = this.originalErrors
        .filter(error => {
          if (this.excludeMFTFlag && error.integrationName === this.MFT_INTEGRATION_NAME) {
            return false;
          }
          if (this.excludePSPFlag && error.target === this.ECASE_DEC_FIELDPSP) {
            return false;
          }
          if (
            this.excludeValidationFlag &&
            error.errorReaon &&
            (error.errorReason.includes(this.VALIDATION_ERROR) ||
              error.errorDetail.includes(this.VALIDATION_ERROR))
          ) {
            return false;
          }
          return true;
        })
        .map(error => {
          error.selected = false;
          if (this.conversationIds.indexOf(error.conversationId) === -1) {
            this.conversationIds.push(error.conversationId);
          }
          if (this.integrationNames.indexOf(error.integrationName) === -1) {
            this.integrationNames.push(error.integrationName);
          }
          if (this.senders.indexOf(error.sender) === -1) {
            this.senders.push(error.sender);
          }
          if (this.targets.indexOf(error.target) === -1) {
            this.targets.push(error.target);
          }
          if (this.errorReasons.indexOf(error.errorReason) === -1) {
            this.errorReasons.push(error.errorReason);
          }
          return error;
        });
    },
    generateAPICall() {
      if (!this.selectedDataCenter || this.checkedRows.length === 0) {
        this.apiCall = "Please select the data center or some errors to generate API call";
        return;
      }

      let errorGuidParam = this.checkedRows
        .map(error => error.errorGUID)
        .reduce((acc, current) => acc.concat(",", current));

      let queryString = `ArchTraceMonitor/tracemonitor/processErrorHospital?errorGuid=${errorGuidParam}&origin=${this.selectedDataCenter.origin}&resultFromOneSide=Y`;

      this.apiCall = `${this.selectedDataCenter.url}${queryString}`;
    }
  },

  data: () => ({
    // Constants
    MFT_INTEGRATION_NAME: "ManagedFileTransferCBS",
    ECASE_DEC_FIELDPSP: "ECASE_DEC_FIELDPSP",
    VALIDATION_ERROR: "VALIDATION",
    dataCenters: [
      { name: "BCC", origin: "BCC", url: "https://esb-soa-soa.asd.census.gov/" },
      { name: "TI-WEST", origin: "TIWEST", url: "https://soa.ti.census.gov/" },
      { name: "TI-EAST", origin: "TIEAST", url: "https://soa.prod.gce.ti.census.gov/" },
      { name: "ONPREM", origin: "ONPREM", url: "https://pr7esbwb019-vip.prod.bdc.ti.census.gov/" }
    ],

    // Filter flags
    excludeMFTFlag: true,
    excludePSPFlag: true,
    excludeValidationFlag: true,

    // Filter arrays
    allConversationIds: true,
    conversationIds: [],
    selectedConversationIds: [],

    allIntegrationNames: true,
    integrationNames: [],
    selectedIntegrationNames: [],

    allSenders: true,
    senders: [],
    selectedSenders: [],

    allTargets: true,
    targets: [],
    selectedTargets: [],

    allErrorReasons: true,
    errorReasons: [],
    selectedErrorReasons: [],

    // Generate API call
    apiCall: "",
    selectedDataCenter: null,

    // Error tables
    currentPage: 1,
    perPage: 500,
    searchInput: "",
    errorsInput: null,
    originalErrors: [],
    footerProps: {
      "items-per-page-options": [10, 50, 100, 500, -1]
    }
  }),

  filters: {
    truncate(value, length) {
      if (!value) return "";
      return value.length > length ? value.substr(0, length) + "..." : value;
    }
  }
};
</script>
