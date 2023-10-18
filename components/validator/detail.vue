<template>
  <div class="info-con">
    <a :href="editURL" target="_blank"><span class="edit">Update validator info?</span></a>
    <Row class="info-con-top">
      <Col span="2" class="left">
        <img v-if="!icon" class="icon" src="~/assets/validator_dafult_icon.svg" />
        <img v-else class="icon" :src="icon" />
        <div v-if="active" class="status">Active</div>
        <div v-else class="status inactive">Inactive</div>
      </Col>
      <Col span="22" class="right">
        <Row class="right-top">
          <Col span="22" class="right-top-left">
            <div class="name">
              <span v-if="name"> {{ name }}</span>
              <span v-else> {{ entityAddress }}</span>
            </div>
            <div class="rank">{{ rank }}</div>
            <a v-if="website" target="_blank" :href="website" title="website"><SvgIcon className="svg" iconName="validator_website"></SvgIcon></a>
            <a v-if="email" target="_blank" :href="`mailto:${email}`" title="email"><SvgIcon className="svg" iconName="validator_email"></SvgIcon></a>
            <a v-if="twitter" target="_blank" :href="`https://twitter.com/${twitter}`" title="twitter"><SvgIcon className="svg" iconName="validator_twitter"></SvgIcon></a>
            <a v-if="keybase" target="_blank" :href="`https://keybase.io/${keybase}`" title="keybase"><SvgIcon className="svg" iconName="validator_keybase"></SvgIcon></a>
          </Col>
          <Col span="2">
            <div v-if="active" class="status">
              <div>√</div>
              <span>Online</span>
            </div>
            <div v-else class="status inactive">
              <div>×</div>
              <span>Offline</span>
            </div>
          </Col>
        </Row>
        <Row class="right-bottom">
          <Col span="12">
            <div class="address">
              <div class="label">Address</div>
              <div class="value">
                <a :href="`/accounts/detail/${entityAddress}`">{{ entityAddress ? entityAddress : '' }}</a>
              </div>
            </div>
          </Col>
          <Col span="12">
            <div class="EntityID">
              <div class="label">Entity ID</div>
              <div class="value">{{ entityId ? entityId : '' }}</div>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
    <Description :list="descriptionList" class="info-con-bot">
      <div slot="bounds">
        {{ bound ? bound.min * 100 + '%' + '~' + bound.max * 100 + '%' : 'No Schedule' }}
        <Tooltip content="1%~25% [start at epoch 14973]">
          <Icon type="ios-information-circle-outline" class="icon" />
        </Tooltip>
      </div>
      <div slot="rates">
        {{ commission | percentFormat }}
        <Tooltip content="1% [start at epoch 14973]">
          <Icon type="ios-information-circle-outline" class="icon" />
        </Tooltip>
      </div>
    </Description>
  </div>
</template>

<script>
import { readable } from '~/utils/index'
import Config from '~/config'
import Description from '~/components/description/index.vue'
export default {
  components: { Description },
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    descriptionList() {
      const list = [
        { title: 'Node ID', content: this.detailData.nodeId || '' },
        { title: 'Escrow', content: readable(this.detailData.escrow) + ' ROSE' || '0 ROSE' },
        { title: 'Delegators', content: readable(this.detailData.delegators) },
        { title: 'Commission Bounds', name: 'bounds' },
        { title: 'Commission Rates', name: 'rates' },
        // { title: 'Paratimes', content: '?' }
      ]
      return list
    }
  },
  data() {
    return {
      name: this.detailData.name || 'Validator',
      // escrow: this.detailData.escrow,
      proposals: this.detailData.proposals,
      signs: this.detailData.signs,
      nodes: this.detailData.nodes || [''],
      balance: this.detailData.balance,
      website: this.detailData.website || '',
      email: this.detailData.email || '',
      twitter: this.detailData.twitter || '',
      keybase: this.detailData.keybase || '',
      icon: this.detailData.icon || '',
      active: this.detailData.active,
      rank: this.detailData.rank,
      entityAddress: this.detailData.entityAddress,
      // delegators: this.detailData.delegators,
      rates: this.detailData.rates,
      bounds: this.detailData.bounds,
      nonce: this.detailData.nonce,
      commission: this.detailData.commission,
      bound: this.detailData.bound,
      entityId: this.detailData.entityId,
      // nodeId: this.detailData.nodeId,
      editURL: Config.editURL
    }
  }
}
</script>

<style scoped lang="scss">
.info-con {
  position: relative;
  .edit {
    z-index: 9;
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: rem(12);
    color: $gray300;
  }
  .info-con-top {
    height: rem(85);
    margin-bottom: rem(20);
    .left {
      .icon {
        width: rem(60);
        height: rem(60);
        border: 0;
        border-radius: rem(30);
      }
      .status {
        height: rem(18);
        line-height: rem(18);
        width: rem(60);
        font-size: rem(12);
        background-color: $success500;
        color: white;
        text-align: center;
        border-radius: rem(8);
        &.inactive {
          background-color: $error500;
        }
      }
    }
    .right {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .right-top {
        .right-top-left {
          display: flex;
          align-items: center;
          .name {
            font-size: rem(18);
          }
          .rank {
            margin-left: rem(10);
            color: white;
            background-color: $theme-color;
            border-radius: 50%;
            width: rem(24);
            height: rem(24);
            line-height: rem(24);
            font-size: rem(12);
            text-align: center;
          }
          a {
            margin-left: rem(10);
            display: flex;
            justify-content: flex-end;
            .svg {
              width: rem(24);
              height: rem(24);
              color: $gray300;
            }
            .svg:hover{
              color: $gray400;
            }
          }
          .extra-icon {
            width: rem(20);
          }
        }
        .status {
          color: $success500;
          text-align: right;
          > div {
            display: inline-block;
            width: rem(16);
            height: rem(16);
            line-height: rem(16);
            border-radius: 50%;
            background-color: $success500;
          }
          &.inactive {
            color: $error500;
            > div {
              color: #fff;
              background-color: $error500;
            }
          }
        }
      }
      .right-bottom {
        .address {
          .value {
            a {
              color: $blue500;
            }
          }
        }
      }
    }
  }
  .info-con-bot {
    border-top: 1px solid $gray100;
    .icon {
      font-size: rem(18);
      margin-left: rem(2);
      vertical-align: -2px;
    }
  }
}
</style>
