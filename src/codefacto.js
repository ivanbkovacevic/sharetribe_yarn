import { createInstance } from 'sharetribe-flex-sdk';
import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;
const { Money, UUID } = sdkTypes;
let userWishList = [{}];


// Create new SDK instance
const sdk = createInstance({
  clientId: '0fd1e949-51a4-4fe0-813e-7d585a661ec5'
});

///////////////////////////////////////////////////

export const showListing = (listingId) => {
  sdk.listings.show({ id: listingId }).then(res => {
    console.log('SHOW LISTING', res.data)
  });
}

//showListing('61b0a902-f813-49a1-8c39-2c5dbfb9c59c')
export const showWishList = async () => {
  let wishListToShow = [];
  return sdk.currentUser.show().then(res => {
    userWishList = res.data.data.attributes.profile.privateData.wishList;
    
    userWishList.map(async (wishId) => {

      sdk.listings.show({ id: wishId }).then(res => {
        let response = res.data.data;
        console.log(response,'-------response--------')
        wishListToShow.push(response)
      });
    })
    return Promise.resolve(wishListToShow);
  });

}

export const addToWishList = async (listingId) => {
  let addedToWishList=false;
  await sdk.currentUser.show().then(res => {
    if(res.data.data.attributes.profile.privateData.wishList){
      userWishList = res.data.data.attributes.profile.privateData.wishList;
    }else{
      userWishList = [{}];
    }
    console.log(userWishList, 'uuuuuuuuuuuuuuuuu')
    addedToWishList=true;
    console.log(addedToWishList,'----added toish list flag')
  });

  if (userWishList.some((el) => listingId === el) === true) {
    console.log('Already in WishList')
    return
  } else {
    userWishList = [...userWishList, listingId];
  }

  if(addedToWishList==true){
    sdk.currentUser.updateProfile({
      privateData: {
        wishList: userWishList,
      },
    }, {
      expand: true
    }).then(res => {
      // res.data
      console.log('Added LISTING to USER wishList', res)
    });
  }
}

export const removeFromWishList = async (listingId) => {
  await sdk.currentUser.show().then(res => {
    // res.data contains the response data
    console.log('CURRETN USER', res)
    userWishList = res.data.data.attributes.profile.privateData.wishList
  });

  userWishList = userWishList.filter((wish) => {
    return wish !== listingId
  })

  sdk.currentUser.updateProfile({
    privateData: {
      wishList: userWishList,
    },
  }, {
    expand: true
  }).then(res => {
    // res.data
    console.log('REMOVED LISTING from USER wishList', res)
  });
}

export const showCurrentUser = () => {
  sdk.currentUser.show().then(res => {
    // res.data contains the response data
    console.log('CURETN USER', res)
  });
}

// const odmah = () => {
//     sdk.currentUser.updateProfile({
//         privateData: {
//           wishList: [],
//         },
//       }, {
//         expand: true
//       }).then(res => {
//         // res.data
//         console.log('ODMAHHHHHHHHHHHREMOVED LISTING from USER wishList', res)
//       });
//     }

//  odmah();