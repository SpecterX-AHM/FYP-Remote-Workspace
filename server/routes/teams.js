const express = require('express');
const path = require('path');
const Team = require('./../models/team');
const User = require('./../models/user');
const TeamMeet = require('./../models/teammeet');
const TeamNote = require('./../models/teamnote');
const Str = require('@supercharge/strings');
const { createTeam } = require('../controllers/teams/team');
const router = express.Router();

router.get('/', async function (req, res) {
  const authid = req.headers.auth_id;
  console.log(authid);
  try {
    const user = await User.findOne({ "user_id": authid });
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    const teams = await Team.find({ "members": user._id }).sort({ createdAt: -1 });
    const teamData = teams.map(team => ({
      id: team._id,
      name: team.name,
      description: team.description,
      code: team.code
    }));
    res.status(200).send({ teams: teamData });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Error fetching user's teams" });
  }
});

// Get team details
router.get('/details', async function (req, res) {
  try {
    const teamid = req.headers.team_id;
    const team = await Team.findById(teamid);
    if (!team) {
      return res.status(404).send({ error: "Team not found" });
    }
    res.status(200).send({ team });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Error fetching team details" });
  }
});

// Get team meetings
router.get('/meetings', async function (req, res) {
  try {
    const teamid = req.headers.team_id;
    const team = await Team.findById(teamid);
    if (!team) {
      return res.status(404).send({ error: "Team not found" });
    }
    const meets = await TeamMeet.find({ "teamid": teamid }).populate([
      {
        path: 'members',
        select: ['name', 'email']
      },
      {
        path: 'host',
        select: ['name']
      }]
    );
    res.status(200).send({ meets });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Error fetching team meetings" });
  }
});

// Create new team
router.post('/new', async function (req, res) {
  console.log(req.body);
  try {
    const user = await User.findOne({ "user_id": req.body.user });
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    const team = await new Team({
      name: req.body.name,
      description: req.body.description,
      code: Str.random(5),
      members: [user._id]
    }).save();
    await User.findByIdAndUpdate(user._id, {
      $push: {
        'teams': team._id
      }
    });
    return res.status(200).json({
      code: team.code,
      teamid: team._id
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Error creating new team" });
  }
});


//join team
router.post('/join', async function (req, res) {
  console.log(req.body)
  try {
    const team = await Team.findOne({ "code": req.body.code })
    if (!team) {
      return res.status(404).json({
        message: 'Team not found'
      })
    }
    const user = await User.findOneAndUpdate({ "user_id": req.body.user }, {
      $addToSet: {
        'teams': team._id
      }
    })
    await Team.findByIdAndUpdate(team._id, {
      $addToSet: {
        'members': user._id
      }
    })
    return res.status(200).json({
      code: team.code
    })

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'User already exists!'
    })

  }
})


//delete team
router.delete('/delete', async (req, res) => {
  const teamid = req.headers.team_id;
  console.log(teamid)
  try {
    await Team.findByIdAndDelete(teamid)
    res.status(200)
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
