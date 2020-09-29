<template>
  <div class="detail-root">
    <nav-bar :active="2"/>
    <div class="page-container container">
      <h1>VALIDATOR INFO</h1>
      <panel>
        <template v-slot:header>
          <span>Detail</span>
          <div class="status-con">
            <div v-if="status" class="success">
              <img src="../../../assets/status-success.svg" /> Registered
            </div>
            <div v-else class="fail">
              <img src="../../../assets/status-fail.svg" /> Not Registered
            </div>
          </div>
        </template>
        <div class="info-con">
         <div class="base-inco">
           <div class="left">
             <img v-if="!icon" class="icon" src="../../../assets/node_icon.png">
             <img v-else class="icon" :src="icon">
             <span v-if="active" class="status">Active</span>
             <span v-else class="status inactive">Inactive</span>
           </div>
           <div class="right">
             <div class="name">
               <span v-if="name"> {{name}}</span>
               <span v-else> {{entityAddress}}</span>
               <div class="rank">{{rank}}</div>
             </div>
             <div class="detail">
               <div class="column column1">
                 <div class="oneline">
                   <div class="label">Entity Address</div>
                   <div class="value">
                     <a :href="`/accounts/detail/${entityAddress}`">{{entityAddress? entityAddress : ''}}</a>
                   </div>
                 </div>
                 <div class="oneline">
                   <div class="label">Com. rates</div>
                   <div class="value">
                     {{commission | percentFormat }}
                     <Poptip v-if="rates && rates.length > 0" trigger="hover" placement="right">
                       <img class="alert" src="../../../assets/alert.svg">
                       <div class="api" slot="content">
                         <div class="rate-item" v-for="rate in rates">
                           <div>{{rate.rate * 100 + '%'}}（start at epoch {{rate.start}}）</div>
                         </div>
                       </div>
                     </Poptip>
                   </div>
                 </div>
                 <div class="oneline">
                   <div class="label">Com. bounds</div>
                   <div class="value">
                     {{bound ? bound.min * 100 + '%' + '~' + bound.max * 100 + '%' : 'No Schedule'}}
                     <Poptip v-if="bounds && bounds.length > 0" trigger="hover" placement="right">
                       <img class="alert" src="../../../assets/alert.svg">
                       <div class="api" slot="content">
                         <div class="rate-item" v-for="boundItem in bounds">
                           <div>{{boundItem.min * 100 + '%' + '~' + boundItem.max * 100 + '%'}}（start at epoch {{boundItem.start}}）</div>
                         </div>
                       </div>
                     </Poptip>
                   </div>
                 </div>
               </div>
               <div class="column column2">
                 <div class="oneline">
                   <div class="label">Entity ID</div>
                   <div class="value">
                     <div class="value">{{entityId? entityId : ''}}</div>
                   </div>
                 </div>
                <div class="oneline">
                   <div class="label">Node ID</div>
                   <div class="value">{{nodeId? nodeId : ''}}</div>
                 </div>
                 <div class="oneline">
                   <div class="label">Delegators</div>
                   <div class="value">{{delegators}}</div>
                 </div>

                 <!--<div class="oneline">-->
                   <!--<div class="label">Nonce</div>-->
                  <!-- <div class="value">{{nonce}}</div>-->
                 <!--</div>-->

                 <!--<div class="oneline">-->
                   <!--<div class="label">Signatures</div>-->
                   <!--<div class="value">{{signs}}</div>-->
                 <!--</div>-->
                 <!--<div class="oneline">-->
                   <!--<div class="label">Proposals</div>-->
                   <!--<div class="value">{{proposals}}</div>-->
                 <!--</div>-->

               </div>
             </div>
           </div>
         </div>
          <div class="sep"></div>
          <!--
          <div class="desc">
            <div class="label">Website</div>
            <div class="value"> <a v-if="website" :href="website">{{website}}</a></div>
          </div>
          <div class="desc">
            <div class="label">Description</div>
            <div class="value">{{description}}</div>
          </div>
          -->
          <div class="desc">
            <div class="label">Extra Info</div>
            <img v-if="!icon"  src="../../../assets/validator_website.svg"> 
            <img v-if="!icon"  src="../../../assets/validator_twitter.svg"> 
            <img v-if="!icon"  src="../../../assets/validator_keybase.svg"> 
          </div>
          <a :href="editURL" target="_blank" class="edit">
            UPDATE VALIDATOR INFO?
          </a>
        </div>
      </panel>
      <div class="list-panels">
        <panel class="voters-panel">
          <template v-slot:header>
            <span>Escrow Status</span>
          </template>
          <div class="status-chart-con">
            <pie-chart :data="escrowAmountStatus"></pie-chart>
            <div class="status-info-con">
              <div class="total-con">
                Total
                <div class="total-value">
                  <div class="value"> {{escrowAmountStatus.total | unit}} </div>
                  <div class="share"> ({{escrowSharesStatus.total}} shares)</div>
                </div>
              </div>
              <div class="compare">
                <div class="self-con">
                  <div class="title"><span class="label">Self</span> <span class="per">({{escrowAmountStatus.self/escrowAmountStatus.total | percentFormat}})</span></div>
                  <div class="values">
                    <div class="value">{{escrowAmountStatus.self}}</div>
                    <div class="share">({{escrowSharesStatus.self}} shares)</div>
                  </div>
                </div>
                <div class="other-con">
                  <div class="self-con">
                    <div class="title"><span class="label">Other</span> <span class="per">({{escrowAmountStatus.other/escrowAmountStatus.total | percentFormat}})</span></div>
                  </div>
                  <div class="values">
                    <div class="value">{{escrowAmountStatus.other}}</div>
                    <div class="share">({{escrowSharesStatus.other}} shares)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </panel>
        <panel class="voters-panel">
          <template v-slot:header>
            <span>Escrow Trend</span>
          </template>
          <div class="escrow-trend-con">
            <trend-chart :trends="escrowTrendData"></trend-chart>
          </div>
        </panel>
      </div>
      <div class="list-panels">
        <panel class="voters-panel">
          <template v-slot:header>
            <span>Signatures</span><span class="title-value">({{signs}})</span>
          </template>
          <div class="sign-states-con">
            <kuai :list="signsStates"></kuai>
          </div>
        </panel>
        <panel class="voters-panel">
          <template v-slot:header>
            <span>Proposals</span><span class="title-value">({{proposals}})</span>
          </template>
          <div class="proposals-states-con">
            <kuai :list="proposalsStates"></kuai>
          </div>
        </panel>
      </div>
      <div class="list-panels">
        <panel v-if="delegatorsList" class="voters-panel half-table-panel">
          <template v-slot:header>
            <span>Delegators</span>
          </template>
          <p v-if="delegatorsList && delegatorsList.length === 0" class="no-result">
            <img class="empty-icon_s" src="../../../assets/empty.svg" />
            No Delegators
          </p>
          <block-table
            v-if="delegatorsList && delegatorsList.length > 0"
            :data="delegatorsList"
            :columns="columns1"
            :expand="false"
            class="block-totasl-list  delegator-table"
            cell-class="block-total-list-cell"
          >
            <template v-slot:address="{data}">
              <a :href="data.link">{{data.text | hashFormat }}</a>
              <span v-if="data.text === entityAddress" class="self-address">(Self)</span>
            </template>
          </block-table>
          <div class="page-navigation">
            <page
              v-if="delegatorsList && delegatorsList.length > 0"
              type="simple"
              :sizer="eventListSizer"
              :records-count="totalDelegatorSize"
              :page="delegatorListPage"
              root-class="block-page"
              @goto="gotoDelegators"></page>
          </div>
        </panel>
        <panel v-if="evensList" class="voters-panel half-table-panel">
          <template v-slot:header>
            <span>Escrow Event</span>
          </template>
          <p v-if="evensList && evensList.length === 0" class="no-result">
            <img class="empty-icon_s" src="../../../assets/empty.svg">
            No Escrow Event
          </p>
          <block-table
            v-if="evensList && evensList.length > 0"
            :data="evensList"
            :columns="columns2"
            :expand="false"
            class="block-total-list events-list"
            cell-class="block-total-list-cell"
          >
            <template v-slot:amountAndShares="slotData">
              <div class="amount-share" :class="positiveStyle(slotData.data.add)">
                {{showAmountShare(slotData.data.value, slotData.data.add)}}
              </div>
            </template>
          </block-table>
          <div v-if="evensList && evensList.length > 0" class="page-navigation">
            <page
              type="simple"
              :sizer="eventListSizer"
              :records-count="totalEventListSize"
              :page="eventListPage"
              root-class="block-page"
              @goto="gotoEvents"/>
          </div>
        </panel>
      </div>
      <panel class="block-list-wrapper">
        <template v-slot:header>
          <span>Proposed Blocks</span>
        </template>
        <block-table class="block-total-list proposed-list" cell-class="block-total-list-cell" :columns="blockListColumns" :data="blockList">
        </block-table>
        <div class="page-navigation">
          <page type="simple" :sizer="blockListSizer" :records-count="totalBlockListSize" :page="blockListPage" root-class="block-page" @goto="goto"></page>
        </div>
      </panel>
    </div>
  </div>
</template>

<script>
  import Panel from '../../../components/Panel'
  import BlockTable from '../../../components/Table/index'
  import Page from '../../../components/Page'
  import NavBar from '../../../components/NavigationBar'
  import PieChart from '../../../components/validator/piechart'
  import TrendChart from '../../../components/validator/trendchart'
  import Kuai from '../../../components/validator/kuai'
  import { getDelegatorsByProposer, getEventsByProposer, fetchValidatorDetail, getBlockByProposer, validatorStats, fetchEscrowTrendByAddress } from '../../../fetch'
  import Config from '../../../config'
  export default {
    name: 'validatorDetail',
    components: {
      NavBar,
      BlockTable,
      Panel,
      Page,
      PieChart,
      TrendChart,
      Kuai
    },
    async asyncData({ $axios, params }) {
      const entityAddress = decodeURIComponent(params.id);
      const data = await Promise.all([
        fetchValidatorDetail($axios, entityAddress),
        fetchEscrowTrendByAddress($axios, entityAddress)])
      const {
        name = 'Validator',
        escrow,
        proposals,
        signs,
        nodes = [''],
        balance,
        website = '',
        icon = '',
        active,
        rank,
        delegators,
        rates,
        bounds,
        nonce,
        ...others
      } = data[0]
      const { list: escrowTrendData } = data[1]
      console.log('escrowTrendData', escrowTrendData)
      // const { signs: signsList, proposals: proposalsList } = await fetchBlockList($axios, entityId)
      const { list: blockList, totalSize: totalBlockListSize } = await getBlockByProposer($axios, entityAddress)
      const res = {
        ...others,
        blockList,
        totalBlockListSize,
        escrowTrendData: [...escrowTrendData].reverse(),
        signsList: [],
        proposalsList: [],
        blockInfo: {},
        name,
        escrow,
        proposals,
        signs,
        nodes,
        balance,
        website,
        icon,
        active,
        rank,
        entityAddress,
        delegators,
        rates,
        bounds,
        nonce,
      }
      return res
    },
    data() {
      return {
        editURL: Config.editURL,
        blockListSizer: 5,
        eventListSizer: 5,
        blockListPage: 1,
        delegatorListPage: 1,
        eventListPage: 1,
        totalDelegatorSize: 0,
        totalEventListSize: 0,
        delegatorsList: null,
        evensList: null,
        signsStates: [],
        proposalsStates: [],
        blockListColumns: [
          {
            title: 'Height',
            key: 'height'
          },
          {
            title: 'Block Hash',
            key: 'hash'
          },
          {
            title: 'Txs',
            key: 'txs'
          },
          {
            title: 'Time',
            key: 'timestamp'
          }
        ],
        list: [],
        columns1: [
          {
            title: 'Address',
            key: 'address',
            slot: true
          },
          {
            title: 'Amount/Shares',
            key: 'amountAndShares'
          },
          {
            title: 'Percentage',
            key: 'percent'
          }
        ],
        columns2: [
          {
            title: 'Height',
            key: 'height'
          },
          {
            title: 'Tx Hash',
            key: 'txHash'
          },
          {
            title: 'Amount/Shares',
            key: 'amountAndShares',
            slot: true
          },
          {
            title: 'Time',
            key: 'timestamp'
          }
        ]
      }
    },
    mounted() {
      this.gotoEvents(1)
      this.gotoDelegators(1)
      this.getStates()
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.repool()
      }, 6000)
    },
    destroyed() {
      this.timer && clearTimeout(this.timer)
      this.timer = null
    },
    methods: {
      async repool() {
        await this.getStates()
        this.timer = setTimeout(() => {
          this.repool()
        }, 5000)
      },
      async getStates() {
        const { signs, proposals } = await validatorStats(this.$axios, this.entityAddress)
        console.log('signs', signs)
        this.signsStates = signs
        this.proposalsStates = proposals
      },
      async goto(pageNumber) {
        const $axios = this.$axios
        const { list, totalSize } = await getBlockByProposer($axios, this.entityAddress, this.blockListSizer, pageNumber)
        this.blockList = list
        this.totalBlockListSize = totalSize
        this.blockListPage = pageNumber
      },
      async gotoEvents(pageNumber) {
        const $axios = this.$axios
        const { list, totalSize } = await getEventsByProposer($axios, this.entityAddress, this.eventListSizer, pageNumber)
        this.evensList = list
        console.log('evensList', list)
        this.totalEventListSize = totalSize
        this.eventListPage = pageNumber
      },
      async gotoDelegators(pageNumber) {
        const $axios = this.$axios
        const { list, totalSize } = await getDelegatorsByProposer($axios, this.entityAddress, this.eventListSizer, pageNumber)
        this.delegatorsList = list
        console.log('delegatorsList', list)
        this.totalDelegatorSize = totalSize
        this.delegatorListPage = pageNumber
      },
      showAmountShare(amountShare, add) {
        if (add) {
          return '+' + amountShare
        } else {
          return '-' + amountShare
        }
      },
      positiveStyle(add) {
        if (add) {
          return 'positive'
        } else {
          return 'negative'
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/common";
  .sign-states-con,.proposals-states-con {
    margin-top: rem(20);
  }
  .proposals-states-con {
    /deep/ {
      .kuai.yes {
        background: url("../../../assets/proposal.svg");
        background-size:  100% 100%;
        width: rem(18);
        height: rem(18);
      }
    }
  }
  .title-value{
    font-size: rem(12);
    color: rgba(0,0,0,.5);
  }
  .status-chart-con {
    display: flex;
    flex-direction: row;
    .status-info-con {
      padding-left: rem(20);
      padding-top: rem(15);
      flex: 1;
      .total-con {
        display: flex;
        flex-direction: row;
        font-size: rem(16);
        line-height: rem(22);
        .total-value {
          padding-left: rem(13);
          .value {
            color: #FF4212;
            font-size: rem(16);
            line-height: rem(22);
          }
          .share {
            color: #5F5F5F;
            font-size: rem(12);
            line-height: rem(17);
          }
        }
      }
      .compare {
        display: flex;
        flex-direction: row;
        font-size: rem(14);
        line-height: rem(22);
        margin-top: rem(17);
        .self-con,.other-con {
          flex: 1;
          .title {
          }
          .value {
            color: #5F5F5F;
          }
          .share {
            color: #5F5F5F;
            font-size: rem(12);
          }
        }
        .self-con .title{
          color: #4CD4A9;
        }
        .other-con .title {
          color: #919191;
        }
      }
    }
  }
  .alert {
    width: rem(16);
    height: rem(16);
    margin-left: rem(7);
    cursor: pointer;
  }
  /deep/ .events-list {
    thead {
      th:nth-child(1) {
        width:rem(90)
      }
      th:nth-child(4) {
        width:rem(110)
      }
    }
  }
  .amount-share{
    &.positive {
      color: #00B538;
    }
    &.negative {
      color: #B60000;
    }
  }
  .container {
    padding-bottom: 2rem;
  }
  .edit {
    position: absolute;
    right: rem(20);
    bottom: rem(28);
    font-size: rem(12);
    line-height: rem(17);
    color: #B8B8B8;
    display: flex;
    align-items: center;
  }
  h1{
    font-size: rem(20);
    margin-bottom: rem(20);
    padding-top: rem(20);
    @include regular;;
    font-weight: normal;
    color: #161616;
    line-height: rem(28);
  }
  .detail-root {
    background-color: #f7f7f7;
  }
  .info-con {
    position: relative;
    padding: rem(20);
    padding-bottom: 0;
    border-radius: rem(8);
    .base-inco {
      display: flex;
      flex-direction: row;
    }
    .sep {
      border-top: 1px solid rgba(0,0,0,0.20);
      height: 0;
      margin-top: rem(18);
      margin-bottom: rem(18);
    }
    .desc {
      line-height: rem(20);
      display: flex;
      align-items: center;
      margin-top: rem(8);
      &:first-child{
        margin-top: rem(0);
      }
      .label {
        @include medium;
        font-size: rem(14);
        color: #3E3E3E;
        width: rem(124);
        text-align: left;
      }
      .value {
        color: #5F5F5F;
        @include regular;
        font-size: rem(11);
        a {
          color: #3273DC;
        }
      }
    }
    .name {
      color: #3E3E3E;
      font-size: rem(16);
      line-height: rem(22);
      @include medium;
      display: flex;
      align-items: center;
    }
    .right {
      margin-left: 2.56rem;
      flex: 1;
      overflow: hidden;
      .detail {
        display: flex;
        flex-direction: row;
        margin-top: rem(16);
      }
      .column {
        overflow: hidden;
        padding-right: 0.5rem;
        flex: 1;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .oneline {
          display: flex;
          flex-direction: row;
          line-height: rem(20);
          margin-top: rem(8);
          .value {
            a {
              &:hover,&:active {
                color: #3273DC;
              }
              color: #3273DC;
            }
          }
          &:first-child {
            margin-top: 0;
          }
        }
        .twoline {
          .value {
            font-size: 0.8rem;
            overflow:hidden; //超出的文本隐藏
            text-overflow:ellipsis; //溢出用省略号显示
            white-space:nowrap; //溢出不换行
          }
        }
        .label {
          font-size: rem(14);
          color: #3E3E3E;
          @include medium;
          width: rem(112);
          text-align: left;
        }
        .value {
          font-size: rem(14);
          color: #5F5F5F;
          flex: 1;
          overflow: hidden;
          display: flex;
          align-items: center;
          @include regular;
          line-height: 1;
        }
      }
    }
    .left {
      width: rem(80);
      position: relative;
    }
    .icon{
      width: rem(80);
      height: rem(80);
      border: 0;
    }
    .status{
      display: block;
      line-height: rem(20);
      width: rem(80);
      font-size: rem(12);
      @include regular;;
      background-color: $theme-color;
      margin: rem(11) auto 0;
      color: white;
      text-align: center;
      border-radius: rem(4);
      &.inactive {
        background-color: #B6B6B6;
      }
    }
    .rank{
      width: rem(22);
      height: rem(22);
      color: white;
      font-size: rem(12);
      display: flex;
      align-content: center;
      justify-content: center;
      background-color: $theme-color;
      border-radius: 50%;
      margin-left: rem(10);
    }
  }
  .list-panels {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: rem(12);
  }
  .voters-panel {
    width: rem(594);
    .block-total-list {
      width: 100%;
      margin-left: 0;
    }
    /deep/ {
      .panel-title {
        align-items: flex-end;
      }
    }
  }
  .page-navigation {
    padding-top: rem(16);
    display: flex;
    justify-content: center;
  }
  .block-list-wrapper {
    margin-top: rem(21);
    padding-bottom: rem(15);
    .block-total-list{
      width: calc(100% - 20px);
      margin-left: 10px;
    }
  }
  .no-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 14px;
    color: rgba(55, 65, 107, 1);
    padding: rem(80) 0;
    .empty-icon {
      width: rem(80);
      margin-bottom: rem(11);
    }
    .empty-icon_s {
      width: rem(50);
      margin-bottom: rem(11);
    }
  }
  .half-table-panel {
    display: flex;
    flex-direction: column;
    /deep/ .panel-content{
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      min-height: rem(272);
    }
    /deep/ .table {
      td,th {
        padding: 18px 10px;
      }
    }
  }
  /deep/ .delegator-table {
    thead tr{
      th:nth-child(1){
        width: rem(200);
      }
      th:nth-child(3){
        width: rem(100);
      }
    }
  }
  .status-con {
    position: absolute;
    right: 0;
    font-size: rem(12);
    color: #5D5D5D;
    .success,.fail {
      display: flex;
      align-items: center;
    }
    img {
      width: rem(12);
      height: rem(12);
      margin-right: rem(6);
    }
  }
  @media(-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2) {
    .info-con {
      .sep {
        border-width: 0.5px;
      }
    }
  }
</style>
