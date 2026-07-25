<template>
  <div class="row my-3 tableComponent">
    <div
      :class="{
        'col-lg-9 py-0': !_static,
        'col-lg-12 py-0': _static || !showAside,
      }"
    >
      <Loader v-if="loading"></Loader>

      <div class="fadeIn" v-else>
        <the-filter
          v-if="showFilter && filterInputs"
          :class="{ active: filterIsActive }"
          :inputs="filterInputs"
          @filterFired="filterFired"
          @closeFilter="toggleFilter"
        />

        <div class="row mb-7">
          <template
            v-if="
              !!staticstics &&
              (tableName == 'drivers' ||
                tableName == 'clients' ||
                tableName == 'contributors' ||
                tableName == 'vehicles')
            "
          >
            <div class="col-lg-4">
              <statistics-card
                :name="
                  tableName == 'drivers'
                    ? 'عدد السائقين'
                    : null || tableName == 'clients'
                    ? 'عدد العملاء'
                    : null || tableName == 'contributors'
                    ? 'عدد  الشركات'
                    : null || tableName == 'vehicles'
                    ? 'عدد  العربات'
                    : null || tableName == 'orders'
                    ? 'عدد  الطلبات'
                    : null
                "
                :value="staticstics.count"
              />
            </div>

            <div class="col-lg-4">
              <statistics-card
                :name="
                  tableName == 'drivers'
                    ? 'عدد السائقين المفعلين'
                    : null || tableName == 'clients'
                    ? 'عدد العملاء المفعلين'
                    : null || tableName == 'contributors'
                    ? 'عدد  الشركات المفعلين'
                    : null || tableName == 'vehicles'
                    ? 'عدد  العربات المفعلة'
                    : null || tableName == 'orders'
                    ? 'عدد  الطلبات المفعلة'
                    : null
                "
                :value="staticstics.active_count"
              />
            </div>
            <div class="col-lg-4">
              <statistics-card
                :name="
                  tableName == 'drivers'
                    ? 'عدد السائقين الغير مفعلين'
                    : null || tableName == 'clients'
                    ? 'عدد العملاء الغير مفعلين'
                    : null || tableName == 'contributors'
                    ? 'عدد  الشركات الغير مفعلين'
                    : null || tableName == 'vehicles'
                    ? 'عدد  العربات الغير مفعلة'
                    : null || tableName == 'orders'
                    ? 'عدد  الطلبات الغير المفعلة'
                    : null
                "
                :value="staticstics.inactive_count"
              />
            </div>
          </template>

          <!-- Orders -->
          <template v-else-if="tableName == 'orders'">
            <div class="col-lg-4">
              <statistics-card
                name="الرحلات المنتهية"
                :value="Math.ceil(staticstics.finished_order_count)"
              />
            </div>
            <div class="col-lg-4">
              <statistics-card
                name="الرحلات الجارية"
                :value="Math.ceil(staticstics.in_progress_order_count)"
              />
            </div>
            <div class="col-lg-4">
              <statistics-card
                name="الرحلات الملغية"
                :value="Math.ceil(staticstics.cancelled_order_count)"
              />
            </div>
            <div class="col-lg-4">
              <statistics-card
                name="نسبة الرحلات المنتهية"
                :value="Math.ceil(staticstics.percentage) + '%'"
              />
            </div>
            <div class="col-lg-4">
              <statistics-card
                name="عدد الرحلات"
                :value="Math.ceil(staticstics.count)"
              />
            </div>
          </template>

          <template v-else>
            <template v-if="otherTabelesStatistics.length > 0">
              <div
                class="col-lg-4"
                v-for="item in otherTabelesStatistics"
                :key="item.id"
              >
                <statistics-card :name="item.name" :value="item.value" />
              </div>
            </template>
          </template>
        </div>

        <section class="position-relative overflow-visible">
          <!-- Start:: Small Screens Filter Button -->
          <button
            class="filter_toggeler my-2"
            @click="toggleFilter"
            v-if="showFilter && filterInputs.length > 0"
          >
            <i class="fas fa-search"></i>
          </button>
          <!-- End:: Small Screens Filter Button -->

          <div class="theTable">
            <!-- Start Main Section -->
            <section>
              <v-data-table
                class="thumb strip"
                :single-select="singleSelect"
                :show-select="
                  tableName == 'drivers' ||
                  tableName == 'clients' ||
                  tableName == 'contributors'
                "
                v-model="selected"
                :headers="headers"
                :items="rows"
                :loading="loading_table"
                :loading-text="$t('table.loadingData')"
                :items-per-page="paginations.items_per_page"
                :expanded.sync="expanded"
                item-key="id"
                hide-default-footer
              >
                <!-- ================== You Can use any slots you want ================== -->
                <!-- Expanded -->
                <template v-slot:expanded-item="{ headers }">
                  <td :colspan="headers.length" class="expandDate fadeIn">
                    <span class="expandTitle" v-if="tableName == 'contacts'">
                      عرض كل الردود
                    </span>
                    <span class="expandTitle" v-else>المزيد من التفاصيل</span>
                    <slot name="expand"></slot>
                  </td>
                </template>

                <!-- ====== Select row field ====== -->
                <template v-slot:[`item.is_complete_data`]="{ item }">
                  {{ helper_boolToText(item.is_complete_data) }}
                </template>

                <!-- Image -->
                <template v-slot:[`item.image`]="{ item }">
                  <img
                    @click="show_model_2"
                    class="image"
                    :src="item.image"
                    v-if="item.image"
                  />
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.flag`]="{ item }">
                  <v-icon
                    v-if="item.flag"
                    @click="show_model_1(item.flag)"
                    class="image"
                  >
                    fas fa-eye
                  </v-icon>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.criminal_record_info_image`]="{ item }">
                  <v-icon
                    v-if="item.criminal_record_info_image"
                    @click="show_model_1(item.criminal_record_info_image)"
                    class="image"
                  >
                    fas fa-eye
                  </v-icon>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.driver_license_image`]="{ item }">
                  <v-icon
                    v-if="item.driver_license_image"
                    @click="show_model_1(item.driver_license_image)"
                    class="image"
                  >
                    fas fa-eye
                  </v-icon>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.id_front_image`]="{ item }">
                  <v-icon
                    v-if="item.id_front_image"
                    @click="show_model_1(item.id_front_image)"
                    class="image"
                  >
                    fas fa-eye
                  </v-icon>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.id_back_image`]="{ item }">
                  <v-icon
                    v-if="item.id_back_image"
                    @click="show_model_1(item.id_back_image)"
                    class="image"
                  >
                    fas fa-eye
                  </v-icon>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.icon`]="{ item }">
                  <v-icon
                    v-if="item.icon"
                    @click="show_model_1(item.icon)"
                    class="image"
                  >
                    fas fa-eye
                  </v-icon>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.avatar`]="{ item }">
                  <img
                    v-if="item.avatar"
                    @click="show_model_2"
                    class="image"
                    :src="item.avatar"
                  />
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.vehicle.vehicle_image`]="{ item }">
                  <router-link :to="`vehicles/show/${item.vehicle?.id}`">
                    <img
                      v-if="item.vehicle && item.vehicle.vehicle_image"
                      @click="show_model_2"
                      class="image"
                      :src="item.vehicle.vehicle_image"
                    />
                    <span class="redColor fontBold" v-else>{{
                      $t("notFound")
                    }}</span>
                  </router-link>
                </template>
                <template v-slot:[`item.vehicle_image`]="{ item }">
                  <img
                    v-if="item.vehicle_image"
                    @click="show_model_2"
                    class="image"
                    :src="item.vehicle_image"
                  />
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.plate_image`]="{ item }">
                  <v-icon
                    v-if="item.plate_image"
                    @click="show_model_1(item.plate_image)"
                    class="image"
                  >
                    fas fa-eye
                  </v-icon>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.vehicle_license_image`]="{ item }">
                  <v-icon
                    v-if="item.vehicle_license_image"
                    @click="show_model_1(item.vehicle_license_image)"
                    class="image"
                  >
                    fas fa-eye
                  </v-icon>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.images.ar`]="{ item }">
                  <v-icon
                    v-if="item.images.ar"
                    @click="show_model_1(item.images.ar)"
                    class="image"
                  >
                    fas fa-eye
                  </v-icon>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.images.en`]="{ item }">
                  <v-icon
                    v-if="item.images.en"
                    @click="show_model_1(item.images.en)"
                    class="image"
                  >
                    fas fa-eye
                  </v-icon>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.companyImage`]="{ item }">
                  <img
                    v-if="item.company"
                    @click="show_model_2"
                    class="image"
                    :src="item.company ? item.company.image : ''"
                  />
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.user.avatar`]="{ item }">
                  <router-link
                    v-if="item.user"
                    :to="`${item.user?.user_type + 's'}/show/${item.user?.id}`"
                  >
                    <img class="image" :src="item.user?.avatar" />
                  </router-link>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.client.avatar`]="{ item }">
                  <router-link
                    v-if="item.client"
                    :to="`clients/show/${item.client?.id}`"
                  >
                    <img class="image" :src="item.client?.avatar" />
                  </router-link>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.clientName`]="{ item }">
                  <router-link
                    v-if="item.client"
                    :to="`clients/show/${item.client?.id}`"
                  >
                    <span>
                      {{ item.client.first_name + " " + item.client.last_name }}
                    </span>
                  </router-link>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.driverName`]="{ item }">
                  <router-link
                    v-if="item.driver"
                    :to="`drivers/show/${item.driver?.id}`"
                  >
                    <span>
                      {{ item.driver.first_name + " " + item.driver.last_name }}
                    </span>
                  </router-link>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.driverVical`]="{ item }">
                  <router-link
                    v-if="item.driver"
                    :to="`drivers/show/${item.driver.id}`"
                  >
                    <span>
                      {{ item.driver.first_name + " " + item.driver.last_name }}
                    </span>
                  </router-link>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.vehicleName`]="{ item }">
                  <router-link
                    v-if="item.vehicle"
                    :to="`vehicles/show/${item.vehicle?.id}`"
                  >
                    <span>
                      {{
                        item.vehicle.first_name + " " + item.vehicle.last_name
                      }}
                    </span>
                  </router-link>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.userNameCachOut`]="{ item }">
                  <router-link
                    v-if="item.user.user_type == 'client'"
                    :to="`clients/show/${item.user.id}`"
                  >
                    <span>
                      {{ item.user.first_name + " " + item.user.last_name }}
                    </span>
                  </router-link>
                  <router-link
                    v-else-if="item.user.user_type == 'driver'"
                    :to="`drivers/show/${item.user.id}`"
                  >
                    <span>
                      {{ item.user.first_name + " " + item.user.last_name }}
                    </span>
                  </router-link>
                  <router-link
                    v-else-if="item.user.user_type == 'contributor'"
                    :to="`contributors/show/${item.user.id}`"
                  >
                    <span>
                      {{ item.user.first_name + " " + item.user.last_name }}
                    </span>
                  </router-link>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.typeCachOut`]="{ item }">
                  <v-chip
                    color="#80c2ff"
                    text-color="#000"
                    v-if="item.user.user_type == 'client'"
                  >
                    عميل
                  </v-chip>
                  <v-chip
                    color="#0086ff"
                    text-color="#fff"
                    v-else-if="item.user.user_type == 'driver'"
                  >
                    سائق
                  </v-chip>
                  <v-chip
                    color="#242355"
                    text-color="#fff"
                    v-else-if="item.user.user_type == 'contributor'"
                  >
                    شركه
                  </v-chip>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.typeReport`]="{ item }">
                  <v-chip
                    color="#80c2ff"
                    text-color="#fff"
                    v-if="item.user_type == 'client'"
                  >
                    عميل
                  </v-chip>
                  <v-chip
                    color="#0086ff"
                    text-color="#fff"
                    v-if="item.user_type == 'driver'"
                  >
                    سائق
                  </v-chip>
                  <v-chip
                    color="#84e8f4"
                    text-color="#000"
                    v-if="item.user_type == 'contributor'"
                  >
                    شركه
                  </v-chip>
                </template>
                <template v-slot:[`item.driver.avatar`]="{ item }">
                  <router-link
                    v-if="item.driver"
                    :to="`drivers/show/${item.driver?.id}`"
                  >
                    <img class="image" :src="item.driver?.avatar" />
                  </router-link>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.vehicle.image`]="{ item }">
                  <router-link
                    v-if="item.vehicle"
                    :to="`vehicles/show/${item.vehicle?.id}`"
                  >
                    <img class="image" :src="item.vehicle?.image" />
                  </router-link>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.phone`]="{ item }">
                  <span v-if="item.phone && item.phone_code">
                    {{ item.phone }} - ({{ item.phone_code }})
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.country`]="{ item }">
                  <span v-if="item.country && item.city">
                    {{ item.country.name }} - {{ item.city.name }}
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.driver`]="{ item }">
                  <router-link
                    :to="'/drivers/show/' + item.id"
                    v-if="item.driver"
                  >
                    {{ item.driver.first_name }}
                    {{ item.driver.last_name }}
                  </router-link>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.manufacturing_year`]="{ item }">
                  <span v-if="item.manufacturing_year">
                    {{ item.manufacturing_year }}
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.created_at`]="{ item }">
                  <span v-if="item.created_at">
                    {{ item.created_at }}
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.created_at_report`]="{ item }">
                  <span v-if="item.report_reason_data.created_at">
                    {{
                      item.report_reason_data.created_at
                        | moment("Do MMMM YYYY, h:mm a")
                    }}
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.cancel_reason_data`]="{ item }">
                  <v-chip
                    color="#8d08c0"
                    text-color="white"
                    v-if="item.cancel_reason_data"
                  >
                    {{ $t("labels.cancel_trip") }}
                  </v-chip>
                  <v-chip
                    color="#c01508"
                    text-color="white"
                    v-if="item.report_reason_data"
                  >
                    {{ $t("labels.report_trip") }}
                  </v-chip>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.order_id`]="{ item }">
                  <router-link
                    :to="'/orders/show/' + item.order_id"
                    v-if="item.order_id"
                  >
                    <v-icon class="show" small>fas fa-eye</v-icon>
                  </router-link>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.report_reason_data`]="{ item }">
                  <span v-if="item.report_reason_data">
                    {{ item.report_reason_data.name }}
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.descReport`]="{ item }">
                  <div class="_actions" v-if="item.report_reason_data.desc">
                    <v-icon
                      class="show"
                      small
                      @click="show_Desc(item.report_reason_data.desc, false)"
                    >
                      fas fa-eye
                    </v-icon>
                  </div>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.actual_distance`]="{ item }">
                  <span v-if="item.actual_distance">
                    {{ Number(item.actual_distance).toFixed() }} ك.م
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.actual_order_duration`]="{ item }">
                  <span v-if="item.actual_order_duration">
                    {{ Number(item.actual_order_duration).toFixed() }} دقيقه
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.amountCachOut`]="{ item }">
                  <span
                    >{{ Number(item.amount).toFixed() }}
                    {{ $t("appCurrency") }}</span
                  >
                </template>
                <template v-slot:[`item.bank_name`]="{ item }">
                  <span>
                    {{ item.bank_name }} - {{ item.city }} - {{ item.branch }}
                  </span>
                </template>
                <template v-slot:[`item.fullnameContact`]="{ item }">
                  <span v-if="item.user">
                    <router-link
                      :to="'/drivers/show/' + item.user.id"
                      v-if="item.user.user_type == 'driver'"
                    >
                      {{ item.user.first_name }} {{ item.user.last_name }}
                    </router-link>
                    <router-link
                      :to="'/clients/show/' + item.user.id"
                      v-if="item.user.user_type == 'client'"
                    >
                      {{ item.user.first_name }} {{ item.user.last_name }}
                    </router-link>
                    <router-link
                      :to="'/contributors/show/' + item.user.id"
                      v-if="item.user.user_type == 'contributor'"
                    >
                      {{ item.user.first_name }} {{ item.user.last_name }}
                    </router-link>
                  </span>
                  <span v-else-if="!item.user">
                    {{ item.fullname }}
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.typeContact`]="{ item }">
                  <span v-if="item.user">
                    <v-chip
                      color="#80c2ff"
                      text-color="#000"
                      v-if="item.user.user_type == 'client'"
                    >
                      عميل
                    </v-chip>
                    <v-chip
                      color="#0086ff"
                      text-color="#fff"
                      v-if="item.user.user_type == 'driver'"
                    >
                      سائق
                    </v-chip>
                    <v-chip
                      color="#378924"
                      text-color="#fff"
                      v-if="item.user.user_type == 'contributor'"
                    >
                      شركه
                    </v-chip>
                  </span>
                  <span v-else-if="!item.user">
                    <v-chip>زائر</v-chip>
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.email`]="{ item }">
                  <span v-if="item.email">
                    {{ item.email }}
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.payment_type`]="{ item }">
                  <span v-if="item.payment_type">
                    {{ item.payment_type }}
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.phoneContact`]="{ item }">
                  <span v-if="item.phone">
                    {{ item.phone }}
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.read_at`]="{ item }">
                  <span v-if="item.read_at">
                    {{ item.read_at }}
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.message`]="{ item }">
                  <div class="_actions">
                    <v-icon
                      class="show"
                      small
                      @click="show_Desc(item.message, false)"
                    >
                      fas fa-eye
                    </v-icon>
                  </div>
                </template>
                <template v-slot:[`item.tripDetails`]="{ item }">
                  <router-link :to="'/orders/show/' + item.id" v-if="item.id">
                    <v-icon class="show" small>fas fa-eye</v-icon>
                  </router-link>
                </template>
                <!-- <template v-slot:[`item.flag`]="{ item }">
                  <img @click="show_model_1" class="image" :src="item.flag" />
                </template>
                <template v-slot:[`item.icon`]="{ item }">
                  <img @click="show_model_1" class="image" :src="item.icon" />
                </template>
                <template v-slot:[`item.avatar`]="{ item }">
                  <img @click="show_model_1" class="image" :src="item.avatar" />
                </template>
                <template v-slot:[`item.vehicle_image`]="{ item }">
                  <img
                    @click="show_model_1"
                    class="image"
                    :src="item.vehicle_image"
                  />
                </template>
                <template v-slot:[`item.plate_image`]="{ item }">
                  <img
                    @click="show_model_1"
                    class="image"
                    :src="item.plate_image"
                  />
                </template>
                <template v-slot:[`item.vehicle_license_image`]="{ item }">
                  <img
                    @click="show_model_1"
                    class="image"
                    :src="item.vehicle_license_image"
                  />
                </template>
                <template v-slot:[`item.images.ar`]="{ item }">
                  <img
                    @click="show_model_1"
                    class="image"
                    :src="item.images.ar"
                  />
                </template>
                <template v-slot:[`item.images.en`]="{ item }">
                  <img
                    @click="show_model_1"
                    class="image"
                    :src="item.images.en"
                  />
                </template>
                <template v-slot:[`item.companyImage`]="{ item }">
                  <img
                    @click="show_model_1"
                    class="image"
                    :src="item.companyImage"
                  />
                </template>
                <template v-slot:[`item.user.avatar`]="{ item }">
                  <router-link
                    :to="`${item.user?.user_type + 's'}/show/${item.user?.id}`"
                  >
                    <img class="image" :src="item.user?.avatar" />
                  </router-link>
                </template>
                <template v-slot:[`item.client.avatar`]="{ item }">
                  <router-link :to="`clients/show/${item.client?.id}`">
                    <img class="image" :src="item.client?.avatar" />
                  </router-link>
                </template>
                <template v-slot:[`item.driver.avatar`]="{ item }">
                  <router-link :to="`drivers/show/${item.driver?.id}`">
                    <img class="image" :src="item.driver?.avatar" />
                  </router-link>
                </template>
                <template v-slot:[`item.vehicle.image`]="{ item }">
                  <router-link :to="`vehicles/show/${item.vehicle?.id}`">
                    <img class="image" :src="item.vehicle?.image" />
                  </router-link>
                </template> -->

                <!-- Desc -->
                <template v-slot:[`item.descAr`]="{ item }">
                  <div class="_actions">
                    <v-icon
                      class="show"
                      small
                      @click="show_Desc(item.ar.desc, false)"
                    >
                      fas fa-eye
                    </v-icon>
                  </div>
                </template>
                <template v-slot:[`item.descEn`]="{ item }">
                  <div class="_actions">
                    <v-icon
                      class="show"
                      small
                      @click="show_Desc(item.en.desc, false)"
                    >
                      fas fa-eye
                    </v-icon>
                  </div>
                </template>
                <template v-slot:[`item.vehicleLicenseImage`]="{ item }">
                  <div class="_actions">
                    <v-icon
                      class="show"
                      small
                      @click="show_model_1(item.vehicleLicenseImage)"
                    >
                      fas fa-eye
                    </v-icon>
                  </div>
                </template>
                <template v-slot:[`item.plateImage`]="{ item }">
                  <div class="_actions">
                    <v-icon
                      class="show"
                      small
                      @click="show_model_1(item.plateImage)"
                    >
                      fas fa-eye
                    </v-icon>
                  </div>
                </template>
                <template v-slot:[`item.desc`]="{ item }">
                  <div class="_actions" v-if="item.desc">
                    <v-icon
                      class="show"
                      small
                      @click="show_Desc(item.desc, false)"
                    >
                      fas fa-eye
                    </v-icon>
                  </div>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.ar.desc`]="{ item }">
                  <div class="_actions" v-if="item.ar.desc">
                    <v-icon
                      class="show"
                      small
                      @click="show_Desc(item.ar.desc, false)"
                    >
                      fas fa-eye
                    </v-icon>
                  </div>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>

                <template v-slot:[`item.en.desc`]="{ item }">
                  <div class="_actions" v-if="item.en.desc">
                    <v-icon
                      class="show"
                      small
                      @click="show_Desc(item.en.desc, false)"
                    >
                      fas fa-eye
                    </v-icon>
                  </div>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>
                <template v-slot:[`item.balance_before`]="{ item }">
                  <span v-if="item.type == 'رصيد'">
                    {{ item.balance_before }}
                  </span>
                  <span v-if="item.type == 'نقاط'">
                    {{ item.point_before }}
                  </span>
                </template>
                <template v-slot:[`item.balance_after`]="{ item }">
                  <span v-if="item.type == 'رصيد'">
                    {{ item.balance_after }}
                  </span>
                  <span v-if="item.type == 'نقاط'">
                    {{ item.point_after }}
                  </span>
                </template>
                <template v-slot:[`item.email`]="{ item }">
                  <span v-if="item.email">
                    {{ "..." + item.email.slice(0, 13) }}
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>

                <!-- Select no data State -->
                <template v-slot:no-data>
                  {{ tableNofound }}
                </template>

                <!-- Select actions-->
                <template v-slot:[`item.actions`]="{ item }">
                  <div class="_actions">
                    <v-icon
                      class="show"
                      v-if="actions.show"
                      small
                      @click="showItem(item)"
                    >
                      fas fa-eye
                    </v-icon>
                    <v-icon
                      class="edit"
                      v-if="actions.edit"
                      small
                      @click="editItem(item)"
                    >
                      fas fa-edit
                    </v-icon>
                    <deleter
                      :items="rows"
                      :name="`${tableName}`"
                      :id="item.id"
                      @refresh="rows = $event"
                    />
                    <!-- <v-icon
                      class="delete"
                      v-if="actions.delete"
                      small
                      @click.stop="deleteItem(item)"
                    >
                      fas fa-trash
                    </v-icon> -->
                  </div>
                </template>
                <template v-slot:[`item.actionsWithoutshow`]="{ item }">
                  <div class="_actions">
                    <v-icon
                      class="edit"
                      v-if="actions.edit"
                      small
                      @click="editItem(item)"
                    >
                      fas fa-edit
                    </v-icon>

                    <v-icon
                      class="delete"
                      v-if="actions.delete"
                      small
                      @click.stop="deleteItem(item)"
                    >
                      fas fa-trash
                    </v-icon>
                  </div>
                </template>

                <template v-slot:[`item.extendIcon`]="{ item }">
                  <div class="_actions">
                    <v-icon class="show" small @click="clickRow(item)">
                      fas fa-angle-double-down
                    </v-icon>
                  </div>
                </template>

                <!-- switch Button -->
                <template v-slot:[`item.is_admin_active_user`]="{ item }">
                  <v-switch
                    @change="switchStatus(item.id)"
                    color="primary"
                    value
                    v-model="item.is_admin_active_user"
                  ></v-switch>
                </template>
                <template v-slot:[`item.is_admin_active_vehicle`]="{ item }">
                  <v-switch
                    @change="switchStatus(item.id)"
                    color="primary"
                    value
                    v-model="item.is_admin_accept"
                  ></v-switch>
                </template>

                <!-- Accept && Reject -->
                <template v-slot:[`item.accept_reject`]="{ item }">
                  <template v-if="item.status == 'pending'">
                    <v-btn
                      @click="handleWalletRequest('accepted', item.id)"
                      class="mx-2"
                      fab
                      dark
                      small
                      color="green"
                    >
                      <v-icon dark>fas fa-check</v-icon>
                    </v-btn>
                    <v-btn
                      @click="handleWalletRequest('rejected', item.id)"
                      class="mx-2"
                      fab
                      dark
                      small
                      color="red"
                    >
                      <v-icon dark>fas fa-times</v-icon>
                    </v-btn>
                  </template>

                  <div v-else class="status">----</div>
                </template>

                <template v-slot:[`item.accept_reject_requests`]="{ item }">
                  <template v-if="item.request_status == 'pending'">
                    <v-btn
                      @click="handleUpdateRequest('accept', item.driver.id)"
                      class="mx-2"
                      fab
                      dark
                      small
                      color="green"
                    >
                      <v-icon dark>fas fa-check</v-icon>
                    </v-btn>
                    <v-btn
                      @click="handleUpdateRequest('reject', item.driver.id)"
                      class="mx-2"
                      fab
                      dark
                      small
                      color="red"
                    >
                      <v-icon dark>fas fa-times</v-icon>
                    </v-btn>
                  </template>

                  <div v-else class="status">----</div>
                </template>
                <template v-slot:[`item.statusCachOut`]="{ item }">
                  <div class="status">
                    <v-chip
                      text-color="#000"
                      v-if="item.status == 'pending'"
                      color="yellow"
                    >
                      منتظره
                    </v-chip>
                    <v-chip
                      text-color="white"
                      v-if="item.status == 'rejected'"
                      color="#980000"
                    >
                      مرفوض
                    </v-chip>
                    <v-chip
                      text-color="white"
                      v-if="item.status == 'accepted'"
                      color="#096800"
                    >
                      مقبول
                    </v-chip>
                  </div>
                </template>
                <template v-slot:[`item.request_status`]="{ item }">
                  <div class="status">
                    <v-chip
                      text-color="#000"
                      v-if="item.request_status == 'pending'"
                      color="yellow"
                    >
                      منتظره
                    </v-chip>
                    <v-chip
                      text-color="white"
                      v-if="item.request_status == 'reject'"
                      color="#980000"
                    >
                      مرفوض
                    </v-chip>
                    <v-chip
                      text-color="white"
                      v-if="item.request_status == 'accept'"
                      color="#096800"
                    >
                      مقبول
                    </v-chip>
                  </div>
                </template>

                <template v-slot:[`item.activeStatus`]="{ item }">
                  <v-chip
                    color="green"
                    text-color="#ffffff"
                    v-if="item.is_active"
                  >
                    مفعل
                  </v-chip>
                  <v-chip color="red" text-color="#ffffff" v-else>
                    غير مفعل
                  </v-chip>
                </template>

                <template v-slot:[`item.orderScheduled`]="{ item }">
                  <v-chip
                    color="green"
                    text-color="#ffffff"
                    v-if="item.is_scheduled"
                  >
                    نعم
                  </v-chip>
                  <v-chip color="red" text-color="#ffffff" v-else>لا</v-chip>
                </template>

                <template v-slot:[`item._activeStatus`]="{ item }">
                  <v-chip
                    color="green"
                    text-color="#ffffff"
                    v-if="item.is_live"
                  >
                    نشط
                  </v-chip>
                  <v-chip color="red" text-color="#ffffff" v-else>
                    غير نشط
                  </v-chip>
                </template>

                <template v-slot:[`item.statusOrder`]="{ item }">
                  <v-chip color="#999" text-color="#ffffff">
                    {{ item.order_status_trans }}
                  </v-chip>
                </template>
                <template v-slot:[`item.driverType`]="{ item }">
                  <v-chip
                    color="primary"
                    class="fontBold"
                    v-if="item.contributor"
                  >
                    مفعل
                  </v-chip>
                  <v-chip
                    color="#84E8F4"
                    text-color="#0086FF"
                    class="fontBold"
                    v-else
                  >
                    غير مفعل
                  </v-chip>
                </template>
                <!-- Concatenate Name-->
                <template v-slot:[`item.name`]="{ item }">
                  <span v-if="item.first_name && item.last_name">
                    {{ (item.first_name + " " + item.last_name).slice(0, 13) }}
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>

                <template v-slot:[`item.name`]="{ item }">
                  <span v-if="item.name">
                    {{ item.name }}
                  </span>
                  <span class="redColor fontBold" v-else>{{
                    $t("notFound")
                  }}</span>
                </template>

                <template v-slot:[`item.driver_type`]="{ item }">
                  <v-chip
                    color="primary"
                    class="fontBold"
                    v-if="item.is_belongs_to_contributor"
                  >
                    تابع لشركة
                  </v-chip>
                  <v-chip
                    color="#84E8F4"
                    text-color="#0086FF"
                    class="fontBold"
                    v-else
                  >
                    شخصي
                  </v-chip>
                </template>
                <template v-slot:[`item.is_active_package`]="{ item }">
                  <v-chip
                    color="green"
                    text-color="#ffffff"
                    v-if="item.is_active"
                  >
                    مفعل
                  </v-chip>
                  <v-chip color="red" text-color="#ffffff" v-else>
                    غير مفعل
                  </v-chip>
                </template>
                <template v-slot:[`item.is_trip_active`]="{ item }">
                  <v-chip
                    color="green"
                    text-color="#ffffff"
                    v-if="item.is_trip_active"
                  >
                    مفعل
                  </v-chip>
                  <v-chip color="red" text-color="#ffffff" v-else>
                    غير مفعل
                  </v-chip>
                </template>
                <template v-slot:[`item.order_type`]="{ item }">
                  <v-chip
                    color="#0086ff"
                    text-color="#fff"
                    v-if="item.order_type == 'trip'"
                  >
                    رحله
                  </v-chip>
                  <v-chip
                    color="#0086ff"
                    text-color="#fff"
                    v-if="item.order_type == 'transfer_package'"
                  >
                    توصيل طلبات
                  </v-chip>
                </template>
                <template v-slot:[`item.is_transfer_package_active`]="{ item }">
                  <v-chip
                    color="green"
                    text-color="#ffffff"
                    v-if="item.is_transfer_package_active"
                  >
                    مفعل
                  </v-chip>
                  <v-chip color="red" text-color="#ffffff" v-else>
                    غير مفعل
                  </v-chip>
                </template>
                <template v-slot:[`item.is_city_to_city_active`]="{ item }">
                  <v-chip
                    color="green"
                    text-color="#ffffff"
                    v-if="item.is_city_to_city_active"
                  >
                    مفعل
                  </v-chip>
                  <v-chip color="red" text-color="#ffffff" v-else>
                    غير مفعل
                  </v-chip>
                </template>
                <template v-slot:[`item.discount_amount`]="{ item }">
                  {{ item.discount_amount }}
                  <span v-if="item.discount_type == 'percentage'">%</span>
                  <span v-if="item.discount_type == 'amount'">{{
                    $t("appCurrency")
                  }}</span>
                  <span></span>
                </template>
                <template v-slot:[`item.amountOffer`]="{ item }">
                  {{ item.amount || $t("notFound") }}
                  <span v-if="item.discount_type == 'percentage'">%</span>
                  <span v-if="item.discount_type == 'amount'">{{
                    $t("appCurrency")
                  }}</span>
                  <span></span>
                </template>

                <template v-slot:[`item.sendReply`]="{ item }">
                  <span style="cursor: pointer" @click="openSendReply(item.id)">
                    <i class="fas fa-reply"></i>
                  </span>
                </template>
                <template v-slot:[`item.transaction_type`]="{ item }">
                  <v-chip
                    color="#768e97"
                    text-color="#fff"
                    v-if="item.is_order && item.order"
                  >
                    <router-link :to="'/orders/show/' + item.order.id">
                      رحله
                    </router-link>
                  </v-chip>
                  <v-chip
                    color="#ee6797"
                    text-color="#fff"
                    v-if="item.transaction_type == 'شحن' && !item.is_order"
                  >
                    {{ item.transaction_type }}
                  </v-chip>
                  <v-chip
                    color="#5779e7"
                    text-color="#fff"
                    v-if="item.transaction_type == 'سحب' && !item.is_order"
                  >
                    {{ item.transaction_type }}
                  </v-chip>
                </template>

                <!-- ======================== Start Top Section ======================== -->
                <template v-slot:top>
                  <!-- Delete dialog -->
                  <deleter
                    v-if="showDelete"
                    :show="dialogDelete"
                    @deleteItemConfirm="deleteItemConfirm"
                  />
                  <v-dialog v-model="dialogDelete_selected" max-width="500px">
                    <v-card>
                      <v-card-title class="text-h5 justify-center">
                        {{ $t("table.deletedialog.areYouSure") }}
                      </v-card-title>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="#1B5E20" @click="deleteSelectedConfirm">
                          {{ $t("table.deletedialog.ok") }}
                        </v-btn>
                        <v-btn
                          color="#F44336"
                          @click="dialogDelete_selected = false"
                        >
                          {{ $t("table.deletedialog.cancel") }}
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-dialog
                    v-model="dialog_sent_notification"
                    max-width="500px"
                  >
                    <v-card>
                      <div class="notificationPopup customCard">
                        <h3 class="h_3">إرسال إشعار</h3>

                        <div class="row">
                          <form @submit.prevent="sendNotifications">
                            <!-- All Users Status -->
                            <v-checkbox
                              v-model="notification_data.is_all_users"
                              :label="$t('labels.is_all_users')"
                            ></v-checkbox>

                            <!-- Title -->
                            <base-input
                              col="12"
                              type="text"
                              :placeholder="$t('labels.title')"
                              :required="true"
                              v-model="notification_data.title"
                            />

                            <!-- Body -->
                            <base-input
                              col="12"
                              type="textarea"
                              :placeholder="$t('labels.content')"
                              :required="true"
                              v-model="notification_data.body"
                            />

                            <base-button :loading="loading" class="center">
                              {{ $t("submit") }}
                            </base-button>
                          </form>
                        </div>
                      </div>
                    </v-card>
                  </v-dialog>

                  <!-- Send Notifications -->
                  <section
                    class="table_buttons"
                    :class="{ active: selected.length > 0 }"
                  >
                    <div
                      class="btn_wrapper send_notifications"
                      v-if="selected.length > 0"
                      @click="openSendNoti()"
                    >
                      <base-button :loading="loading">
                        إرسال إشعار
                      </base-button>
                    </div>
                  </section>
                </template>
                <!-- ======================== End Top Section ======================== -->
              </v-data-table>
            </section>
            <!-- End Main Section -->

            <!-- Start Pagination -->
            <template v-if="!this._static">
              <div class="pagination_container text-center mb-5">
                <v-pagination
                  circle
                  v-model="paginations.current_page"
                  :length="paginations.last_page"
                  :total-visible="6"
                ></v-pagination>
              </div>
            </template>
            <!-- End Pagination -->

            <!-- Start Image_Model -->
            <ImageModal
              :modalIsOpen="model_1.show_model"
              :modalImage="model_1.model_img_src"
              @toggleModal="model_1.show_model = false"
            />
            <!-- End Image_Model -->

            <!-- Start Base_Model -->
            <base-model :show="showDesc" @close="closeDesc">
              <div>
                <p
                  class="with_border"
                  v-if="!descImage"
                  v-html="descData || $t('notFound')"
                ></p>
                <div class="v-card v-sheet theme--light" v-else>
                  <img class="with_border" :src="descData" />
                </div>
              </div>
            </base-model>
            <!-- End Base_Model -->

            <base-model
              :show="sendReplyShow"
              @close="sendReplyShow = false"
              name="fadeIn"
            >
              <form @submit.prevent="sendReply">
                <div class="row p-5 text-center">
                  <h3 class="h_3">ارسل رد</h3>

                  <!-- Start:: Reply -->
                  <base-input
                    col="12"
                    type="textarea"
                    :placeholder="$t('labels.reply')"
                    :required="true"
                    v-model="sendReplyData.reply"
                  />
                  <!-- End:: Reply -->

                  <!-- Start:: SendType -->
                  <base-select-input
                    col="12"
                    v-model="sendReplyData.send_type"
                    :static="true"
                    :staticItems="sendTypes"
                    :placeholder="$t('labels.send_type')"
                  ></base-select-input>
                  <!-- End:: SendType -->
                </div>

                <base-button :loading="sendReply_loading" class="center">
                  {{ $t("submit") }}
                </base-button>
              </form>
            </base-model>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { v4 as uuidv4 } from "uuid";

// Start:: Importing Chats Aside
import ChartsAside from "@/components/Layouts/ChartsAside.vue";
// End:: Importing Chats Aside

import ImageModal from "@/components/Modals/ImageModal.vue";

export default {
  components: {
    ChartsAside,
    ImageModal,
  },

  props: {
    noExpand: {
      type: Boolean,
      required: false,
    },
    headers: {
      required: true,
      default: [],
    },
    tableName: {
      required: true,
      default: "",
    },
    tableNofound: {
      default: "",
    },
    actions: {
      required: false,
      default: () => {
        return {
          show: true,
          edit: true,
          delete: true,
        };
      },
    },
    filterInputs: {
      type: Array,
      required: false,
    },
    _static: {
      type: Boolean,
      required: false,
    },
    staticRows: {
      type: Array,
      required: false,
    },
    showFilter: {
      type: Boolean,
      required: false,
      default: true,
    },
    showDelete: {
      type: Boolean,
      required: false,
      default: true,
    },
    showAside: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      // ========== Charts Dummy Data
      chartsData: null,
      staticstics: null,
      otherTabelesStatistics: [],

      sendReplyShow: false,

      // ========== Charts Aside
      asideIsActive: false,

      // ========== Filter
      filterIsActive: false,

      // ========== Expand
      expanded: [],

      // ========== Selected Data
      selected: [],
      singleSelect: false,

      // ========== dialog Status
      dialogDelete: false,
      itemtoDelete: null,
      dialogDelete_selected: false,
      dialog_sent_notification: false,

      // ========== Model
      model_1: {
        show_model: false,
        model_img_src: "",
      },

      // ========== rows
      rows: [],

      // ========== pagination
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 20,
      },

      // ========== Loding

      loading_table: false,
      loading: false,
      sendReply_loading: false,

      //========== Desc
      showDesc: false,
      descData: "",
      descImage: "",

      notification_data: {
        title: null,
        body: null,
        user_type: null,
        is_all_users: false,
      },

      sendReplyData: {
        send_type: null,
        reply: null,
        sendReplyID: null,
      },
    };
  },

  watch: {
    [`paginations.current_page`]() {
      this.filterFired();
    },
  },

  computed: {
    ...mapGetters({
      lang: "lang_module/lang",
    }),

    sendTypes() {
      if (this.lang == "ar") {
        return [
          // {
          //   id: 1,
          //   name: "اشعار اداري",
          //   value: "fcm",
          // },
          {
            id: 2,
            name: "رسالة نصية",
            value: "sms",
          },
          {
            id: 3,
            name: "بريد الكتروني",
            value: "email",
          },
        ];
      }
      return [
        {
          id: 1,
          name: "Fcm",
          value: "fcm",
        },
        {
          id: 2,
          name: "Sms",
          value: "sms",
        },
        {
          id: 3,
          name: "Email",
          value: "email",
        },
      ];
    },
  },

  methods: {
    openSendNoti() {
      // const ASIDE = document.querySelector(".chart_aside");
      // console.log(ASIDE);
      // ASIDE.style.zIndex = "-1";
      // ASIDE.style.position = "relative";
      this.dialog_sent_notification = true;
      this.notification_data.title = null;
      this.notification_data.body = null;
      this.notification_data.user_type = null;
      this.notification_data.is_all_users = false;
    },

    openSendReply(id) {
      this.sendReplyData.sendReplyID = id;
      this.sendReplyShow = true;
    },

    sendReply() {
      this.sendReply_loading = true;

      // Create FormData
      const data = new FormData();
      data.append("reply", this.sendReplyData.reply);
      data.append("send_vai", this.sendReplyData.send_type?.value);
      // data.append("_method", "PUT");

      // =============== Start:: Send Reply ===============
      this.axios({
        method: "POST",
        url: `contacts/${this.sendReplyData.sendReplyID}/reply`,
        data: data,
      })
        .then(() => {
          this.$iziToast.success({
            displayMode: 2,
            title: this.$t("success"),
            message: this.$t("sendSuccess"),
          });
          this.setRows();
          this.sendReply_loading = false;
          this.showForm = false;
          this.sendReplyShow = false;
          this.sendReplyData.send_type = null;
          this.sendReplyData.reply = null;
        })
        .catch((err) => {
          this.sendReply_loading = false;
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("error"),
            message: err.response.data.message,
          });
        });
      // =============== End:: Send Reply ===============
    },

    // ===== ShowDesc
    show_Desc(item, img) {
      this.showDesc = true;
      this.descData = item;
      this.descImage = img;
    },

    closeDesc() {
      this.showDesc = false;
    },

    // ===== SwitchStatus
    switchStatus(id) {
      this.axios({
        method: "GET",
        url: `${this.tableName}/${id}/status`,
      })
        .then((res) => {
          console.log(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // ===== Filter
    filterFired(data) {
      this.loading_table = true;
      this.axios({
        method: "GET",
        url: `${this.tableName}`,
        params: { page: this.paginations.current_page, ...data },
      })
        .then((res) => {
          this.paginations.last_page = res.data.meta.last_page;
          this.paginations.items_per_page = res.data.meta.per_page;

          this.rows = res.data.data;

          // ========== Statistics
          this.chartsData = {
            charts: res.data.statistc,
            percentage: Math.ceil(res.data.statistc?.percentage),
            type: this.tableName,
          };

          this.staticstics = null;
          this.staticstics = {
            count: res.data.statistc?.count,
            percentage: res.data.statistc?.percentage,
            active_count: res.data.statistc?.active_count,
            inactive_count: res.data.statistc?.inactive_count,
            cancelled_order_count: res.data.statistc?.cancelled_order_count,
            in_progress_order_count: res.data.statistc?.in_progress_order_count,
            finished_order_count: res.data.statistc?.finished_order_count,
          };

          this.loading_table = false;
        })
        .catch((err) => {
          // console.log(err.response.data.messages);
          this.$iziToast.error({
            title: this.$t("validation.error"),
            message: err.response.data.messages,
          });
          this.loading_table = false;
        });
    },

    // ===== Toggle Aside
    toggleAside() {
      this.asideIsActive = !this.asideIsActive;
    },

    // ===== Toggle Filter
    toggleFilter() {
      this.filterIsActive = !this.filterIsActive;
    },

    // ===== Expand
    clickRow(rowData) {
      if (this.noExpand) return;
      const indexExpanded = this.expanded.findIndex((i) => i === rowData);
      if (indexExpanded > -1) {
        // Exisit
        this.expanded.splice(indexExpanded, 1);
      } else {
        this.expanded = [];
        this.expanded.push(rowData);
      }
      this.$emit("expandFired", rowData);
    },

    // ===== img Model
    show_model_1(src) {
      this.model_1.model_img_src = src;
      this.model_1.show_model = true;
    },
    show_model_2(e) {
      this.model_1.model_img_src = e.target.src;
      this.model_1.show_model = true;
    },

    // ===== Handle Wallet Request
    handleWalletRequest(status, id) {
      this.axios({
        method: "POST",
        url: `cash_outs/${id}`,
        data: { status: status },
      }).then(() => {
        this.$emit("updateRows");
      });
    },

    handleUpdateRequest(status, id) {
      const data = new FormData();

      data.append("driver_id", id);
      data.append("status", status);

      this.axios({
        method: "POST",
        url: `update_requests`,
        data: data,
      }).then(() => {
        this.setRows();
      });
    },

    // ==================== Start CRUD ====================
    addItem() {
      this.$router.push({ path: `/${this.tableName}/add` });
    },
    showItem(item) {
      if (
        this.tableName == "drivers" ||
        this.tableName == "clients" ||
        this.tableName == "contributors" ||
        this.tableName == "vehicles" ||
        this.tableName == "orders"
      ) {
        this.$router.push({ path: `/${this.tableName}/show/` + item.id });
        return;
      } else if (this.tableName == "ordersCars") {
        this.$router.push({ path: `/orders/show/` + item.id });
      } else {
        this.clickRow(item);
      }
    },
    editItem(item) {
      this.$router.push({ path: `/${this.tableName}/edit/` + item.id });
    },

    // ===== Delete
    deleteItem(item) {
      // this.dialogDelete = true;
      this.itemtoDelete = item;

      // Start:: Sweet Alert  Modal
      this.$swal({
        title: "هل أنت متأكد؟",
        text: "لن يكون بإمكانك الرجوع في العملية!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "لا",
        confirmButtonText: "نعم احذف!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteItemConfirm();
        }
      });
      // End:: Sweet Alert  Modal
    },
    deleteItemConfirm() {
      this.axios({
        method: "DELETE",
        url: `${this.tableName}/${this.itemtoDelete.id}`,
      })
        .then(() => {
          this.rows = this.rows.filter((item) => {
            return item.id != this.itemtoDelete.id;
          });
          this.dialogDelete = false;
          // Start:: Sweet Alert  Modal
          this.$swal({
            title: "تم الحذف بنجاح",
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "نعم",
          });
          this.setRows();
          // End:: Sweet Alert  Modal
        })
        .catch((err) => {
          this.dialogDelete = false;
          this.$iziToast.error({
            timeout: 2000,
            message: err.response.data.message,
            position: "bottomRight",
          });
        });
    },
    deleteSelected() {
      this.dialogDelete_selected = true;
    },
    deleteSelectedConfirm() {
      this.axios({
        method: "POST",
        url: `${this.tableName}/deleteAll`,
        data: { ids: this.selected.map((item) => item.id) },
      })
        .then(() => {
          this.rows = this.rows.filter((item) => {
            return !this.selected.filter((obj) => obj.id == item.id).length > 0;
          });
          this.dialogDelete_selected = false;
          this.$iziToast.error({
            timeout: 2000,
            message: this.$t("deleteSuccess"),
            position: "bottomRight",
          });
        })
        .catch((err) => {
          this.dialogDelete_selected = false;
          this.$iziToast.error({
            timeout: 2000,
            message: err.response.data.message,
            position: "bottomRight",
          });
        });
    },
    // ==================== End CRUD ====================

    // Set Rows
    setRows() {
      if (this._static) {
        this.loading = true;
        this.rows = this.staticRows;
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      } else {
        this.loading = true;
        this.axios({
          method: "GET",
          url: `${this.tableName}`,
          params: { page: this.paginations.current_page },
        })
          .then((res) => {
            if (this.tableName == "update_requests") {
              this.rows = [
                ...res.data.data.accept.map((object) => {
                  return {
                    ...object,
                    request_status: "accept",
                  };
                }),
                ...res.data.data.pending.map((object) => {
                  return {
                    ...object,
                    request_status: "pending",
                  };
                }),
                ...res.data.data.reject.map((object) => {
                  return {
                    ...object,
                    request_status: "reject",
                  };
                }),
              ].map((object) => {
                return {
                  ...object,
                  id: uuidv4(),
                };
              });
              this.loading = false;
              return;
            } else {
              this.paginations.last_page = res.data.meta.last_page;
              this.paginations.items_per_page = res.data.meta.per_page;

              this.rows = res.data.data;

              // ========== Statistics
              this.chartsData = {
                charts: res.data.statistc,
                percentage: Math.ceil(res.data.statistc?.percentage),
                count: res.data.meta.total,
                type: this.tableName,
              };

              this.staticstics = null;

              if (res.data.statistc) {
                this.staticstics = {
                  count: res.data.statistc?.count,
                  percentage: res.data.statistc?.percentage,
                  active_count: res.data.statistc?.active_count,
                  inactive_count: res.data.statistc?.inactive_count,
                  cancelled_order_count:
                    res.data.statistc?.cancelled_order_count,
                  in_progress_order_count:
                    res.data.statistc?.in_progress_order_count,
                  finished_order_count: res.data.statistc?.finished_order_count,
                };
              }

              if (res.data.statistics) {
                this.otherTabelesStatistics = res.data.statistics;
              }
              this.loading = false;
            }
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      }
    },

    // Send Notification
    sendNotifications() {
      this.loading = true;

      const data = new FormData();
      data.append("all", +this.notification_data.is_all_users);
      data.append(
        "user_type",
        this.tableName.slice(0, this.tableName.length - 1)
      );
      data.append("title", this.notification_data.title);
      data.append("body", this.notification_data.body);
      if (!this.notification_data.is_all_users) {
        this.selected.forEach((item, index) => {
          data.append(`user_ids[${index}]`, item.id);
        });
      }

      this.axios({
        method: "POST",
        url: `/notifications`,
        data: data,
      })
        .then(() => {
          this.$iziToast.success({
            title: this.$t("success"),
            message: this.$t("sendSuccess"),
          });
          this.dialog_sent_notification = false;
          this.loading = false;
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response.data.message,
          });
          this.loading = false;
        });
    },
  },

  // ======= hooks
  created() {
    this.control = this.$permission.setControls(this.$route.path);
    // Set Rows
    this.setRows();
  },
};
</script>

<style scoped lang="scss">
.notificationPopup {
  padding: 15px;
  text-align: center;
  border-radius: 15px;
}

.btn_wrapper {
  width: fit-content;
}

.with_border {
  text-align: center;
  padding: 20px;
  color: var(--main);
  display: flex;
  justify-content: center;
}
</style>
