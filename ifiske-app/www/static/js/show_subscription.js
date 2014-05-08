
Subs = Object.freeze({

  go: function(id)
  {
    Database.getSubscriptionByid(id, function(result)
    {
      if (result != null)
      {
        Navigate.to('card', {card: result});

      }
      else
      {
        throw Error('No such subscription ID');
      }
    });

  }

});
