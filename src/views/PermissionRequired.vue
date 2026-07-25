<template>
  <div class="permission">
    <div class="loader">
      <img
        width="250"
        src="@/assets/media/images/Icons/permission.jpg"
        alt=""
      />
    </div>
    <div class="text">
      <h2>{{ $t("notAllowed") }}</h2>
      <h4>{{ $t("iThinkYouJustWentToUnAllowedPage") }}</h4>
      <router-link to="/">{{ $t("clickHereToGoBack") }}</router-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.permission {
  background: #fff;
  // background-image: radial-gradient(#888, #555);
  height: 100vh;
  display: flex;

  flex-direction: column;
  overflow: hidden;

  .text {
    // transform: translateY(-40px);
    // margin-bottom: 20px;
    text-align: center;

    h1 {
      font-size: 100px;
      margin: 0;
      background: -webkit-linear-gradient(var(--main), #1e1e1e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
    }

    h2 {
      font-size: 40px;
      margin: 0;
      font-weight: 500;
    }

    h4 {
      margin: 0;
      font-size: 25px;
      color: var(--mainText);
      font-weight: 500;
      margin-block: 20px;
    }

    a {
      text-decoration: underline;
      color: #004b8e;
    }

    @media (max-width: 600px) {
      h1 {
        font-size: 100px;
      }
      h2 {
        font-size: 40px;
      }
      h4 {
        font-size: 20px;
      }
    }
  }
}

.loader {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    // width: 100%;
    // max-width: 600px;.loader {
    margin-bottom: 30px;
  }
}
</style>
